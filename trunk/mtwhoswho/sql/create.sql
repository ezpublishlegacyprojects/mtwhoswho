CREATE TABLE mtwhoswho (
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    contentobject_attribute_id INT(11) NOT NULL,
    source VARCHAR(32) NOT NULL,
    source_id INT NOT NULL,
    x INT NOT NULL,
    y INT NOT NULL
);