import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../db/dbclient";
import * as Errors from "../../error/errors";
import { validateData } from "../../validation/validate";

export const getLieferanten = async (
    event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  let connection;

  try {
    connection = await getConnection();

    const [Lieferanten] = await connection.query("SELECT * FROM lieferant");

    const lieferantenObj = { Lieferanten };
    const validatedData = validateData("handlerlieferantSchema", lieferantenObj);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Daten erfolgreich ans FE gesendet",
        data: validatedData,
        lieferanten: validatedData.Lieferanten
      }),
    };
  } catch (error) {
    return Errors.handleError(error, "handlerGetLieferanten");
  } finally {
    if (connection) connection.release();
    await closePool();
  }
};
