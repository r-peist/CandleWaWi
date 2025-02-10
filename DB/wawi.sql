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

-- --------------------------------------------------------
-- Tabelle: behaelter
-- --------------------------------------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

REPLACE INTO `behaelter` (`BehaelterID`, `MatID`, `Name`, `Farbe`, `Hoehe`, `Breite`, `Fuellmenge`) VALUES
	(1, 3, 'Glas1', 'Braun', 75, 25, 180),
	(2, 4, 'Glas2', 'Schwarz', 100, 35, 300),
	(3, 5, 'Glas3', 'Weiß', 100, 35, 300),
	(4, 10, 'Glas4', 'Braun', 200, 25, 100);

-- --------------------------------------------------------
-- Tabelle: bestellung (erweitert um status und Kommentar)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bestellung` (
  `BestellID` int(11) NOT NULL AUTO_INCREMENT,
  `LiefID` int(11) NOT NULL,
  `LagerID` int(11) NOT NULL,
  `Bestelldatum` date NOT NULL,
  `status` ENUM('offen', 'pruefung', 'abgeschlossen') NOT NULL DEFAULT 'offen',
  PRIMARY KEY (`BestellID`),
  KEY `Bestellung_LiefID` (`LiefID`),
  KEY `Bestellung_LagerID` (`LagerID`),
  CONSTRAINT `Bestellung_LagerID` FOREIGN KEY (`LagerID`) REFERENCES `lager` (`LagerID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Bestellung_LiefID` FOREIGN KEY (`LiefID`) REFERENCES `lieferant` (`LiefID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

REPLACE INTO `bestellung` (`BestellID`, `LiefID`, `LagerID`, `Bestelldatum`, `status`, `Kommentar`) VALUES
	(1, 1, 1, '2024-02-12', 'in_pruefung'),
	(2, 1, 1, '2024-04-22', 'offen'),
	(3, 1, 1, '2024-09-11', 'abgeschlossen'),
	(4, 3, 1, '2024-12-02', 'abgelehnt');

-- --------------------------------------------------------
-- Tabelle: deckel
-- --------------------------------------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

REPLACE INTO `deckel` (`DeckelID`, `MatID`, `Name`, `Farbe`, `Material`) VALUES
	(1, 6, 'Holzdeckel', 'Braun', 'Holz'),
	(2, '7', 'Aludeckel', 'Schwarz', 'Alu'),
	(3, '11', 'DiffusorDeckel', 'Schwarz', 'Plastik');

-- --------------------------------------------------------
-- Tabelle: docht
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `docht` (
  `DochtID` int(11) NOT NULL AUTO_INCREMENT,
  `MatID` int(11) NOT NULL,
  `Laenge` int(11) NOT NULL,
  `Material` varchar(50) NOT NULL,
  PRIMARY KEY (`DochtID`),
  KEY `Docht_MatID` (`MatID`),
  CONSTRAINT `Docht_MatID` FOREIGN KEY (`MatID`) REFERENCES `material` (`MatID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

REPLACE INTO `docht` (`DochtID`, `MatID`, `Laenge`, `Material`) VALUES
	(1, 8, 75, 'Baumwolle'),
	(2, 9, 120, 'Holz');

-- --------------------------------------------------------
-- Tabelle: inventarkorrektur
-- --------------------------------------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

REPLACE INTO `inventarkorrektur` (`InvKorrID`, `MatID`, `LagerID`, `Titel`, `Kommentar`, `Datum`, `Menge`) VALUES
	(1, 3, 1, 'Kaputt', 'Joar ist kaputt ne', '2024-02-12', 2),
	(2, 4, 1, 'Kaputt', 'Kaputt ne', '2024-02-12', 5);

-- --------------------------------------------------------
-- Tabelle: kategorie
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `kategorie` (
  `KatID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  PRIMARY KEY (`KatID`),
  UNIQUE KEY `KatID` (`KatID`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

REPLACE INTO `kategorie` (`KatID`, `Name`) VALUES
	(1, 'Endprodukt'),
	(4, 'Rohmaterial'),
	(6, 'Verpackungsmat'),
	(5, 'Zubehör'),
	(2, 'zugekauftesEndprod'),
	(3, 'Zwischenprodukt');

-- --------------------------------------------------------
-- Tabelle: lager
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `lager` (
  `LagerID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL DEFAULT '',
  `Anschrift` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`LagerID`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

REPLACE INTO `lager` (`LagerID`, `Name`, `Anschrift`) VALUES
	(1, 'Burgstraße', 'Burgstraße 8 Werni'),
	(2, 'Keller', 'Bei Chris'),
	(3, 'Messe', 'Messe');

-- --------------------------------------------------------
-- Tabelle: lieferant
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `lieferant` (
  `LiefID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  PRIMARY KEY (`LiefID`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

REPLACE INTO `lieferant` (`LiefID`, `Name`) VALUES
	(1, 'Amazon'),
	(2, 'Destrebution'),
	(3, 'ExternerLadeneinkauf');

-- --------------------------------------------------------
-- Tabelle: material
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `material` (
  `MatID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL DEFAULT '',
  `KatID` int(11) NOT NULL,
  `MatKatID` int(11) NOT NULL,
  `SKU` varchar(150) DEFAULT '',
  `Active` set('true','false') NOT NULL DEFAULT '',
  PRIMARY KEY (`MatID`),
  UNIQUE KEY `Name` (`Name`),
  UNIQUE KEY `SKU` (`SKU`),
  KEY `Mat_KatID` (`KatID`),
  KEY `Mat_MatKatID` (`MatKatID`),
  CONSTRAINT `Mat_KatID` FOREIGN KEY (`KatID`) REFERENCES `kategorie` (`KatID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Mat_MatKatID` FOREIGN KEY (`MatKatID`) REFERENCES `materialkategorie` (`MatKatID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

REPLACE INTO `material` (`MatID`, `Name`, `KatID`, `MatKatID`, `SKU`, `Active`) VALUES
	(1, 'Wachs_Soja_40.000g', 4, 2, 'WAX-001-NAT', 'true'),
	(2, 'Wachs_Soja_60.000g', 4, 2, 'WAX-002-SOY', 'false'),
	(3, 'Glas_Braun_180ml', 4, 4, 'CON-001-GLASS-BROWN', 'true'),
	(4, 'Glas_Schwarz_300ml', 4, 4, 'CON-002-GLASS-BLACK', 'true'),
	(5, 'Glas_Weiß_300ml', 4, 4, 'CON-003-GLASS-WHITE', 'false'),
	(6, 'Holzdeckel_Braun', 4, 11, 'LID-001-WOOD-BROWN', 'true'),
	(7, 'Aludeckel_Schwarz', 4, 11, 'LID-002-ALU-BLACK', 'true'),
	(8, 'Docht_Baumwolle1', 4, 3, 'WCK-001-COTTON', 'true'),
	(9, 'Docht_Holz1', 4, 3, 'WCK-002-WOOD', 'false'),
	(10, 'Glas_Diffusor_Braun', 4, 4, 'CON-004-GLASS-BROWN', 'true'),
	(11, 'Diffusor_Deckel', 4, 11, 'LID-003-DIFF', 'true'),
	(12, 'Öl_1', 4, 8, 'OIL-001-LAVENDER', 'true'),
	(13, 'Öl_2', 4, 8, 'OIL-002-LAVENDER', 'true'),
	(14, 'Wasser', 4, 5, 'LIQ-001-WAT', 'true'),
	(15, 'Alkohol', 4, 5, 'LIQ-002-ALC', 'true'),
	(16, 'WarnungKerze', 4, 12, 'WAR-001-CAN', 'true'),
	(17, 'WarnungDifSpray', 4, 12, 'WAR-001-DIF', 'true');

-- --------------------------------------------------------
-- Tabelle: materialbestellung (erweitert um ursprüngliche und angenommene Menge)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `materialbestellung` (
  `MatBestID` int(11) NOT NULL AUTO_INCREMENT,
  `BestellID` int(11) NOT NULL,
  `MatID` int(11) NOT NULL,
  `Menge` int(11) NOT NULL,
  PRIMARY KEY (`MatBestID`),
  KEY `MatBestell_BestellID` (`BestellID`),
  KEY `MatBestell_MatID` (`MatID`),
  CONSTRAINT `MatBestell_BestellID` FOREIGN KEY (`BestellID`) REFERENCES `bestellung` (`BestellID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `MatBestell_MatID` FOREIGN KEY (`MatID`) REFERENCES `material` (`MatID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

REPLACE INTO `materialbestellung` (`MatBestID`, `BestellID`, `MatID`, `urspruengliche_menge`, `angenommene_menge`, `Kommentar`) VALUES
	(1, 1, 1, 3),
	(2, 1, 3, 42),
	(3, 1, 6, 42);

-- --------------------------------------------------------
-- Tabelle: materialkategorie
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `materialkategorie` (
  `MatKatID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Einheit` varchar(3) NOT NULL,
  PRIMARY KEY (`MatKatID`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

REPLACE INTO `materialkategorie` (`MatKatID`, `Name`, `Einheit`) VALUES
	(1, 'Endprodukt', 'stk'),
	(2, 'Wachs', 'g'),
	(3, 'Docht', 'stk'),
	(4, 'Behältnis', 'stk'),
	(5, 'Gemisch', 'ml'),
	(6, 'Karton', 'stk'),
	(7, 'Tüte', 'stk'),
	(8, 'Öl', 'ml'),
	(9, 'Etiketten', 'stk'),
	(10, 'Geschenkboxen', 'stk'),
	(11, 'Deckel', 'stk'),
	(12, 'WarnEtikett', 'stk'),
	(13, 'Sonstiges', 'stk');

-- --------------------------------------------------------
-- Tabelle: materiallager
-- --------------------------------------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

REPLACE INTO `materiallager` (`MatLagerID`, `MatID`, `LagerID`, `Menge`) VALUES
	(1, 1, 1, 2),
	(2, 2, 1, 4),
	(3, 3, 1, 42),
	(4, 4, 1, 42),
	(5, 5, 1, 42),
	(6, 6, 1, 42),
	(7, 7, 1, 42),
	(8, 8, 1, 112),
	(9, 9, 1, 55);

-- --------------------------------------------------------
-- Tabelle: materiallieferant
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `materiallieferant` (
  `MatLiefID` int(11) NOT NULL AUTO_INCREMENT,
  `MatID` int(11) NOT NULL,
  `LiefID` int(11) NOT NULL,
  `Link` varchar(2500) NOT NULL,
  PRIMARY KEY (`MatLiefID`),
  KEY `MatLief_MatID` (`MatID`),
  KEY `MatLief_LiefID` (`LiefID`),
  CONSTRAINT `MatLief_LiefID` FOREIGN KEY (`LiefID`) REFERENCES `lieferant` (`LiefID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `MatLief_MatID` FOREIGN KEY (`MatID`) REFERENCES `material` (`MatID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

REPLACE INTO `materiallieferant` (`MatLiefID`, `MatID`, `LiefID`, `Link`) VALUES
	(1, 1, 1, 'https://www.amazon.de/'),
	(2, 2, 1, 'https://www.amazon.de/'),
	(3, 3, 2, 'https://marketplacedistribution.com/'),
	(4, 4, 2, 'https://marketplacedistribution.com/'),
	(5, 5, 2, 'https://marketplacedistribution.com/'),
	(6, 6, 2, 'https://marketplacedistribution.com/');

-- --------------------------------------------------------
-- Tabelle: rezeptkerze
-- --------------------------------------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

REPLACE INTO `rezeptkerze` (`RezeptKerzeID`, `Name`, `MatID`, `BehaelterID`, `DeckelID`, `DochtID`, `ZPRezeptID`, `WarnEttID`) VALUES
	(1, 'Kaffee', 1, 1, 2, 1, 2, 1),
	(2, 'Lavendel', 1, 1, 2, 1, 2, 1),
	(3, 'Vanille', 1, 1, 2, 1, 2, 1),
	(4, 'Lebkuchen', 1, 1, 2, 1, 2, 1),
	(5, 'Rhabarber Zimt Zauber', 1, 2, 1, 2, 2, 1);

-- --------------------------------------------------------
-- Tabelle: rezeptspraydif
-- --------------------------------------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

REPLACE INTO `rezeptspraydif` (`RezeptSprayDifID`, `Name`, `BehaelterID`, `DeckelID`, `ZPRezeptID1`, `ZPRezeptID2`, `WarnEttID`) VALUES
	(1, 'Kaffee', 4, 3, 1, 3, 2),
	(2, 'Lavendel', 4, 3, 1, 3, 2),
	(3, 'Vanille', 4, 3, 1, 3, 2),
	(4, 'Lebkuchen', 4, 3, 1, 3, 2);

-- --------------------------------------------------------
-- Tabelle: rezeptzutaten
-- --------------------------------------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

REPLACE INTO `rezeptzutaten` (`RezeptZutatenID`, `ZPRezeptID`, `MatID`, `Menge`) VALUES
	(1, 1, 12, 40),
	(2, 1, 13, 60),
	(3, 2, 12, 100),
	(4, 3, 14, 80),
	(5, 3, 15, 20);

-- --------------------------------------------------------
-- Tabelle: warnettikett
-- --------------------------------------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

REPLACE INTO `warnettikett` (`WarnEttID`, `MatID`, `Name`, `Farbe`, `Hoehe`, `Breite`, `Material`) VALUES
	(1, 16, 'WarnungKerze', 'weiß', 10, 20, 'Folie'),
	(2, 17, 'WarnungDifSpray', 'weiß', 20, 30, 'Folie');

-- --------------------------------------------------------
-- Tabelle: zwischenproduktrezept
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `zwischenproduktrezept` (
  `ZPRezeptID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL DEFAULT '',
  `Beschreibung` varchar(250) NOT NULL DEFAULT '',
  `Erstellungsdatum` date NOT NULL,
  `Änderungsdatum` date DEFAULT NULL,
  PRIMARY KEY (`ZPRezeptID`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

REPLACE INTO `zwischenproduktrezept` (`ZPRezeptID`, `Name`, `Beschreibung`, `Erstellungsdatum`, `Änderungsdatum`) VALUES
	(1, 'Duftmische1', 'Joar is ne Mische ne', '2024-11-27', '2024-11-27'),
	(2, 'NurÖl1', 'junge junge ganz schön viel Öl', '1990-08-27', '2024-11-27'),
	(3, 'Mische1DifSpray', 'Mischmasch wischwasch', '1999-09-11', '2024-12-28');

-- --------------------------------------------------------
-- Trigger: ratioLiquids
-- --------------------------------------------------------
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `ratioLiquids` AFTER INSERT ON `rezeptzutaten` FOR EACH ROW 
BEGIN
    IF NEW.Menge < 1 OR NEW.Menge > 101 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Wert muss zwischen 1 und 101 liegen.';
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
