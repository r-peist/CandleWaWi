-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server-Version:               11.6.2-MariaDB - mariadb.org binary distribution
-- Server-Betriebssystem:        Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Exportiere Datenbank-Struktur für wawi
CREATE DATABASE IF NOT EXISTS `wawi` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `wawi`;

-- Exportiere Struktur von Tabelle wawi.behaelter
CREATE TABLE IF NOT EXISTS `behaelter` (
  `BehaelterID` int(11) NOT NULL AUTO_INCREMENT,
  `MatID` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL DEFAULT '',
  `Farbe` varchar(50) NOT NULL DEFAULT '',
  `Hoehe` int(11) NOT NULL,
  `Breite` int(11) NOT NULL,
  `Fuellmenge` int(11) NOT NULL,
  PRIMARY KEY (`BehaelterID`),
  UNIQUE KEY `Name` (`Name`),
  KEY `Behaelter_MatID` (`MatID`),
  CONSTRAINT `Behaelter_MatID` FOREIGN KEY (`MatID`) REFERENCES `material` (`MatID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle wawi.behaelter: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle wawi.bestellung
CREATE TABLE IF NOT EXISTS `bestellung` (
  `BestellID` int(11) NOT NULL AUTO_INCREMENT,
  `LiefID` int(11) NOT NULL,
  `LagerID` int(11) NOT NULL,
  `Bestelldatum` date NOT NULL,
  PRIMARY KEY (`BestellID`),
  KEY `Bestellung_LiefID` (`LiefID`),
  KEY `Bestellung_LagerID` (`LagerID`),
  CONSTRAINT `Bestellung_LagerID` FOREIGN KEY (`LagerID`) REFERENCES `lager` (`LagerID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Bestellung_LiefID` FOREIGN KEY (`LiefID`) REFERENCES `lieferant` (`LiefID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle wawi.bestellung: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle wawi.deckel
CREATE TABLE IF NOT EXISTS `deckel` (
  `DeckelID` int(11) NOT NULL AUTO_INCREMENT,
  `MatID` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL DEFAULT '',
  `Farbe` varchar(50) NOT NULL DEFAULT '',
  `Material` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`DeckelID`),
  UNIQUE KEY `Name` (`Name`),
  KEY `Deckel_MatID` (`MatID`),
  CONSTRAINT `Deckel_MatID` FOREIGN KEY (`MatID`) REFERENCES `material` (`MatID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle wawi.deckel: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle wawi.docht
CREATE TABLE IF NOT EXISTS `docht` (
  `DochtID` int(11) NOT NULL AUTO_INCREMENT,
  `MatID` int(11) NOT NULL,
  `Laenge` int(11) NOT NULL,
  `Material` varchar(50) NOT NULL,
  PRIMARY KEY (`DochtID`),
  KEY `Docht_MatID` (`MatID`),
  CONSTRAINT `Docht_MatID` FOREIGN KEY (`MatID`) REFERENCES `material` (`MatID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle wawi.docht: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle wawi.inventarkorrektur
CREATE TABLE IF NOT EXISTS `inventarkorrektur` (
  `InvKorrID` int(11) NOT NULL AUTO_INCREMENT,
  `MatID` int(11) NOT NULL,
  `LagerID` int(11) NOT NULL,
  `Titel` varchar(50) NOT NULL DEFAULT '',
  `Kommentar` varchar(150) NOT NULL DEFAULT '',
  `Datum` date NOT NULL,
  `Menge` int(11) NOT NULL,
  PRIMARY KEY (`InvKorrID`),
  KEY `InvKorr_MatID` (`MatID`),
  KEY `InvKorr_LagerID` (`LagerID`),
  CONSTRAINT `InvKorr_LagerID` FOREIGN KEY (`LagerID`) REFERENCES `lager` (`LagerID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `InvKorr_MatID` FOREIGN KEY (`MatID`) REFERENCES `material` (`MatID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle wawi.inventarkorrektur: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle wawi.kategorie
CREATE TABLE IF NOT EXISTS `kategorie` (
  `KatID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  PRIMARY KEY (`KatID`),
  UNIQUE KEY `KatID` (`KatID`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle wawi.kategorie: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle wawi.lager
CREATE TABLE IF NOT EXISTS `lager` (
  `LagerID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL DEFAULT '',
  `Anschrift` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`LagerID`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle wawi.lager: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle wawi.lieferant
CREATE TABLE IF NOT EXISTS `lieferant` (
  `LiefID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  PRIMARY KEY (`LiefID`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle wawi.lieferant: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle wawi.material
CREATE TABLE IF NOT EXISTS `material` (
  `MatID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL DEFAULT '',
  `KatID` int(11) NOT NULL,
  `MatKatID` int(11) NOT NULL,
  `SKU` varchar(150) UNIQUE DEFAULT NULL,
  `Active` SET('true', 'false') NOT NULL DEFAULT 'true',
  PRIMARY KEY (`MatID`),
  UNIQUE KEY `Name` (`Name`),
  KEY `Mat_KatID` (`KatID`),
  KEY `Mat_MatKatID` (`MatKatID`),
  CONSTRAINT `Mat_KatID` FOREIGN KEY (`KatID`) REFERENCES `kategorie` (`KatID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Mat_MatKatID` FOREIGN KEY (`MatKatID`) REFERENCES `materialkategorie` (`MatKatID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


-- Exportiere Daten aus Tabelle wawi.material: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle wawi.materialbestellung
CREATE TABLE IF NOT EXISTS `materialbestellung` (
  `MatBestID` int(11) NOT NULL AUTO_INCREMENT,
  `BestellID` int(11) NOT NULL,
  `MatID` int(11) NOT NULL,
  `Menge` int(11) NOT NULL,
  `Kommentar` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`MatBestID`),
  KEY `MatBestell_BestellID` (`BestellID`),
  KEY `MatBestell_MatID` (`MatID`),
  CONSTRAINT `MatBestell_BestellID` FOREIGN KEY (`BestellID`) REFERENCES `bestellung` (`BestellID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `MatBestell_MatID` FOREIGN KEY (`MatID`) REFERENCES `material` (`MatID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle wawi.materialbestellung: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle wawi.materialkategorie
CREATE TABLE IF NOT EXISTS `materialkategorie` (
  `MatKatID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Einheit` varchar(3) NOT NULL,
  PRIMARY KEY (`MatKatID`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle wawi.materialkategorie: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle wawi.materiallager
CREATE TABLE IF NOT EXISTS `materiallager` (
  `MatLagerID` int(11) NOT NULL AUTO_INCREMENT,
  `MatID` int(11) NOT NULL,
  `LagerID` int(11) NOT NULL,
  `Menge` int(11) NOT NULL,
  PRIMARY KEY (`MatLagerID`),
  KEY `MatLager_MatID` (`MatID`),
  KEY `MatLager_LagerID` (`LagerID`),
  CONSTRAINT `MatLager_LagerID` FOREIGN KEY (`LagerID`) REFERENCES `lager` (`LagerID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `MatLager_MatID` FOREIGN KEY (`MatID`) REFERENCES `material` (`MatID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle wawi.materiallager: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle wawi.materiallieferant
CREATE TABLE IF NOT EXISTS `materiallieferant` (
  `MatLiefID` int(11) NOT NULL AUTO_INCREMENT,
  `MatID` int(11) NOT NULL,
  `LiefID` int(11) NOT NULL,
  `Link` varchar(250) NOT NULL,
  PRIMARY KEY (`MatLiefID`),
  UNIQUE KEY `Link` (`Link`),
  KEY `MatLief_MatID` (`MatID`),
  KEY `MatLief_LiefID` (`LiefID`),
  CONSTRAINT `MatLief_LiefID` FOREIGN KEY (`LiefID`) REFERENCES `lieferant` (`LiefID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `MatLief_MatID` FOREIGN KEY (`MatID`) REFERENCES `material` (`MatID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle wawi.materiallieferant: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle wawi.rezeptkerze
CREATE TABLE IF NOT EXISTS `rezeptkerze` (
  `RezeptKerzeID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL DEFAULT '',
  `MatID` int(11) NOT NULL,
  `BehaelterID` int(11) NOT NULL,
  `DeckelID` int(11) NOT NULL,
  `DochtID` int(11) NOT NULL,
  `ZPRezeptID` int(11) NOT NULL,
  `WarnEttID` int(11) NOT NULL,
  PRIMARY KEY (`RezeptKerzeID`),
  UNIQUE KEY `Name` (`Name`),
  KEY `RezeptKerze_MatID` (`MatID`),
  KEY `RezeptKerze_BehaelterID` (`BehaelterID`),
  KEY `RezeptKerze_DeckelID` (`DeckelID`),
  KEY `RezeptKerze_DochtID` (`DochtID`),
  KEY `RezeptKerze_ZPRezeptID` (`ZPRezeptID`),
  KEY `RezeptKerze_WarnEttID` (`WarnEttID`),
  CONSTRAINT `RezeptKerze_BehaelterID` FOREIGN KEY (`BehaelterID`) REFERENCES `behaelter` (`BehaelterID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `RezeptKerze_DeckelID` FOREIGN KEY (`DeckelID`) REFERENCES `deckel` (`DeckelID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `RezeptKerze_DochtID` FOREIGN KEY (`DochtID`) REFERENCES `docht` (`DochtID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `RezeptKerze_MatID` FOREIGN KEY (`MatID`) REFERENCES `material` (`MatID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `RezeptKerze_WarnEttID` FOREIGN KEY (`WarnEttID`) REFERENCES `warnettikett` (`WarnEttID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `RezeptKerze_ZPRezeptID` FOREIGN KEY (`ZPRezeptID`) REFERENCES `zwischenproduktrezept` (`ZPRezeptID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle wawi.rezeptkerze: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle wawi.rezeptspraydif
CREATE TABLE IF NOT EXISTS `rezeptspraydif` (
  `RezeptSprayDifID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `BehaelterID` int(11) NOT NULL,
  `DeckelID` int(11) NOT NULL,
  `ZPRezeptID1` int(11) NOT NULL,
  `ZPRezeptID2` int(11) NOT NULL,
  `WarnEttID` int(11) NOT NULL,
  PRIMARY KEY (`RezeptSprayDifID`),
  UNIQUE KEY `Name` (`Name`),
  KEY `RezeptSprayDif_BehaelterID` (`BehaelterID`),
  KEY `RezeptSprayDif_DeckelID` (`DeckelID`),
  KEY `RezeptSprayDif_ZPRezept1` (`ZPRezeptID1`),
  KEY `RezeptSprayDif_ZPRezept2` (`ZPRezeptID2`),
  KEY `RezeptSprayDif_WarnEttID` (`WarnEttID`),
  CONSTRAINT `RezeptSprayDif_BehaelterID` FOREIGN KEY (`BehaelterID`) REFERENCES `behaelter` (`BehaelterID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `RezeptSprayDif_DeckelID` FOREIGN KEY (`DeckelID`) REFERENCES `deckel` (`DeckelID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `RezeptSprayDif_WarnEttID` FOREIGN KEY (`WarnEttID`) REFERENCES `warnettikett` (`WarnEttID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `RezeptSprayDif_ZPRezept1` FOREIGN KEY (`ZPRezeptID1`) REFERENCES `zwischenproduktrezept` (`ZPRezeptID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `RezeptSprayDif_ZPRezept2` FOREIGN KEY (`ZPRezeptID2`) REFERENCES `zwischenproduktrezept` (`ZPRezeptID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle wawi.rezeptspraydif: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle wawi.rezeptzutaten
CREATE TABLE IF NOT EXISTS `rezeptzutaten` (
  `RezeptZutatenID` int(11) NOT NULL AUTO_INCREMENT,
  `ZPRezeptID` int(11) NOT NULL,
  `MatID` int(11) NOT NULL,
  `Menge` int(11) NOT NULL,
  PRIMARY KEY (`RezeptZutatenID`),
  KEY `RezeptZutaten_ZPRezeptID` (`ZPRezeptID`),
  KEY `RezeptZutaten_MatID` (`MatID`),
  CONSTRAINT `RezeptZutaten_MatID` FOREIGN KEY (`MatID`) REFERENCES `material` (`MatID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `RezeptZutaten_ZPRezeptID` FOREIGN KEY (`ZPRezeptID`) REFERENCES `zwischenproduktrezept` (`ZPRezeptID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle wawi.rezeptzutaten: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle wawi.warnettikett
CREATE TABLE IF NOT EXISTS `warnettikett` (
  `WarnEttID` int(11) NOT NULL AUTO_INCREMENT,
  `MatID` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Farbe` varchar(50) NOT NULL,
  `Hoehe` int(11) NOT NULL,
  `Breite` int(11) NOT NULL,
  `Material` varchar(50) NOT NULL,
  PRIMARY KEY (`WarnEttID`),
  UNIQUE KEY `Name` (`Name`),
  KEY `WarnEtt_MatID` (`MatID`),
  CONSTRAINT `WarnEtt_MatID` FOREIGN KEY (`MatID`) REFERENCES `material` (`MatID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle wawi.warnettikett: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle wawi.zwischenproduktrezept
CREATE TABLE IF NOT EXISTS `zwischenproduktrezept` (
  `ZPRezeptID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL DEFAULT '',
  `Beschreibung` varchar(250) NOT NULL DEFAULT '',
  `Erstellungsdatum` date NOT NULL,
  `Änderungsdatum` date DEFAULT NULL,
  PRIMARY KEY (`ZPRezeptID`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Exportiere Daten aus Tabelle wawi.zwischenproduktrezept: ~0 rows (ungefähr)

-- Exportiere Struktur von Trigger wawi.ratioLiquids
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='';
DELIMITER //
CREATE TRIGGER `ratioLiquids` AFTER INSERT ON `rezeptzutaten` FOR EACH ROW begin
    IF NEW.Menge < 1 OR NEW.Menge > 100 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Wert muss zwischen 1 und 100 liegen.';
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Exportiere Struktur von Trigger wawi.valid_url
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='';
DELIMITER //
CREATE TRIGGER `valid_url` BEFORE INSERT ON `materiallieferant` FOR EACH ROW BEGIN
DECLARE is_valid_url BOOLEAN;
    SET is_valid_url = NEW.link REGEXP '^(https?|ftp)://[^\s/$.?#].[^\s]*$';
    IF NOT is_valid_url THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ungültige URL';
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
