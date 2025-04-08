import { APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../db/dbclient";
import * as Errors from "../../error/errors";
import { ValidatedEvent } from "../../interfaces";
import { validateData } from "../../validation/validate";

export const handlerMatLief = async (
    event: ValidatedEvent<{ Lieferant: { LiefID: number } }>
): Promise<APIGatewayProxyResult> => {
  let connection;

  try {
    const { Lieferant: { LiefID } } = event.validatedBody;
    console.log("Empfangene LiefID:", LiefID);

    connection = await getConnection();

    const [rows] = await connection.query(
        `
      SELECT 
        ml.MatLiefID,
        ml.MatID,
        ml.LiefID,
        ml.Link,
        m.Name AS MaterialName,
        l.Name AS LieferantName
      FROM materiallieferant ml
      INNER JOIN material m ON ml.MatID = m.MatID
      INNER JOIN lieferant l ON ml.LiefID = l.LiefID
      WHERE ml.LiefID = ?
    `,
        [LiefID]
    );

    const MatLiefs = { MatLiefs: rows };
    const validatedData = validateData("matLiefSchema", MatLiefs);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Materialdaten erfolgreich geladen",
        data: validatedData,
      }),
    };
  } catch (error) {
    return Errors.handleError(error, "handlerGetMatLief");
  } finally {
    if (connection) connection.release();
    await closePool();
  }
};
