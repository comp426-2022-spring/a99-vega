SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE User (
    UserId INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Email VARCHAR(255) DEFAULT NULL,
    Username VARCHAR(255) DEFAULT NULL,
    Password VARCHAR(255) DEFAULT NULL,
    ProfilePicture BINARY DEFAULT NULL,
    Status VARCHAR(255) DEFAULT "Active"
);

CREATE TABLE Submission (
    SubmissionId INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    UserId INT(11) DEFAULT NULL,
    Longitude DECIMAL(8,6) DEFAULT NULL,
    Latitude DECIMAL (9,6) DEFAULT NULL,
    Address VARCHAR(255) DEFAULT NULL,
    Date DATETIME DEFAULT NULL,
    CrowdSize VARCHAR(255) DEFAULT NULL,
    ComplianceScore INT(11) DEFAULT NULL,
    MaskScore INT(11) DEFAULT NULL,
    DistancingScore INT(11) DEFAULT NULL,
    SuppliesScore INT(11) DEFAULT NULL
);
ALTER TABLE Submission ADD CONSTRAINT submission_fk_1 FOREIGN KEY (UserId) REFERENCES User (UserId);

COMMIT;