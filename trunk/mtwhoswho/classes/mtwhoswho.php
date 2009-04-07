<?php
/*
// SOFTWARE NAME: MT Who'S Who
// COPYRIGHT NOTICE: Copyright (C) 2009 Maxime THOMAS
// SOFTWARE LICENSE: GNU General Public License v3.0
// NOTICE: >
//  This file is part of MT Who's Who.
//
//  MT Who's Who is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  MT Who's Who is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with MT Who's Who.  If not, see <http://www.gnu.org/licenses/>.
*/
class MTWhoswho extends eZPersistentObject
{
	public $ID;
	public $ContentObjectAttributeID;
    public $Source;
    public $SourceID;
    public $X;
    public $Y;
	
    /**
     * Creator
     * @param $row
     */
    function MTWhoswho( $row )
    {
        $this->eZPersistentObject( $row );
    }

    /**
     * Define the fields
     * @return array
     */
    static function definition()
    {
        return array( 
        	"fields" => array( 
        		"id" => array( 
        			"name" => "ID",
					"datatype" => "integer",
					"default" => 0,
					"required" => true,
       			),
        		"contentobject_attribute_id" => array( 
        			"name" => "ContentObjectAttributeID",
					"datatype" => "integer",
					"default" => 0,
					"required" => true,
					"foreign_class" => "eZContentObjectAttribute",
					"foreign_attribute" => "id",
					"multiplicity" => "1..*" 
       			),
				"source_id" => array( 
					"name" => "SourceID",
                	"datatype" => "string",
                    "default" => "",
					"required" => true
       			),
                "source" => array( 
                	"name" => "Source",
                    "datatype" => "string",
                    "default" => "",
                    "required" => true
       			),
                "x" => array( 
                	"name" => "X",
                    "datatype" => "integer",
                    "default" => 0,
                    "required" => true
       			),
                "y" => array( 
                	"name" => "Y",
                    "datatype" => "integer",
                    "default" => 0,
                    "required" => true
       			),
			),
            "keys" => array("id"),
			"relations" => array( 
				"contentobject_attribute_id" => array( 
					"class" => "eZContentObjectAttribute",
					"field" => "id" 
				) 
			),
            "class_name" => "MTWhoswho",
            "name" => "mtwhoswho" 
		);
    }

    /**
     * Fetch the list of objects
     * @param $asObject
     * @return Array of objects
     */
    public static function fetchList( $conditions, $asObject = true )
    {    	
        return eZPersistentObject::fetchObjectList( MTWhoswho::definition(),
                                                    null, $conditions, null, null,
                                                    $asObject );
    }

}

?>