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
include_once( "lib/ezutils/classes/ezfunctionhandler.php" );
include_once( "lib/ezutils/classes/ezmodule.php" );
include_once( "extension/mtwhoswho/classes/mtwhoswho.php");

class MTWhoswhoServerCallFunctions
{

	private static function checkAttribute($attribute_id)
	{
		if (!$attribute_id){
			throw new Exception("You must provide an attribute id.");
		}
		
		//As we don't have an object, we must fetch at least one attribute id 
		//to reach the object and then the class
		$objectList = eZPersistentObject::fetchObjectList( eZContentObjectAttribute::definition(),
			null,
            array("id"=>$attribute_id),
            null,
            1,
            true,
            null,
        	null 
        );
		
		if (!count($objectList)>0)
		{
			throw new Exception("There is no attribute corresponding to the provided id.");
		}
		else
		{
			return $objectList[0];
		}
	}
	
	private static function checkSource($attribute, $results)
	{
		$object = $attribute->object();
		$contentclass_id=$object->attribute("contentclass_id");	
			
		$ini =& eZINI::instance("mtwhoswho.ini");
        $sources = $ini->variable("ContentSettings", "Sources");

		if (!isset($sources[$contentclass_id]))
		{
			throw new Exception("There is no data source linked to this content class. Check your configuration.");
		}
		else
		{
			$source_id=$sources[$contentclass_id];
			$source = $ini->group("Source_".$source_id);
			if (!$source)
			{
				throw new Exception("There is no source called ".$source_id.". Check your configuration.");
			}
			else 
			{
				$source["SourceString"]=$source_id;
				return $source;
			}
		}	
	}
		
	public static function getListOf($params)
	{
		$results=array(
			"data"=>array(),
			"errors"=>array(),
		);
		$attribute_id=$params[0];
		
		try
		{
			$attribute = MTWhoswhoServerCallFunctions::checkAttribute($attribute_id);
			$source = MTWhoswhoServerCallFunctions::checkSource($attribute);

			include_once("extension/mtwhoswho/classes/handlers/mtwhoswho_handler_".$source["SourceString"].".php");
			$source_handler_class_name = "MTWhoswhoHandler".ucfirst($source["SourceString"]);
			$handler = new $source_handler_class_name();
	
			$results["data"]=$handler->getListOf($attribute_id, $source);
		}catch(Exception $e){
			$results["errors"]=$e->getLine()." : ".$e->getMessage(). " ".$e->getTraceAsString();
		}
		
		return json_encode($results);
	}
	
	/**
	 * Return the people according to the provided attribute_id
	 * @param $params Attribute id
	 * @return Array
	 */
	public static function load($params)
	{
		$results=array(
			"data"=>array(),
			"errors"=>array()
		);
		$attribute_id=$params[0];
		
		try
		{
			$attribute = MTWhoswhoServerCallFunctions::checkAttribute($attribute_id);
			$source = MTWhoswhoServerCallFunctions::checkSource($attribute);
			
			$conds=array(
	    		"contentobject_attribute_id"=>$attribute_id,
			);
			
			$data = MTWhoswho::fetchList($conds);
			
			include_once("extension/mtwhoswho/classes/handlers/mtwhoswho_handler_".$source["SourceString"].".php");
			$source_handler_class_name = "MTWhoswhoHandler".ucfirst($source["SourceString"]);
			$handler = new $source_handler_class_name();
	
			foreach ($data as $d)
			{
				$name = $handler->getName($d->attribute("source_id"), $source);
				$results["data"][]=array(
					"id"=>$d->attribute("source_id"),
					"name"=>$name,
					"x"=>$d->attribute("x"),
					"y"=>$d->attribute("y"),
				);
			}
		}catch(Exception $e){
			$results["errors"]=$e->getLine()." : ".$e->getFile()." : ".$e->getMessage();
		}
		return json_encode($results);
	}

	public static function save($params)
	{
		$attribute_id = $params[0];
		$results=array(
			"data"=>array(),
			"errors"=>array()
		);
		
		try
		{		
			$people = array();
			array_shift($params);
			
			for ($i = 0; $i < count($params); $i=$i+3) {
				$people[]=array(
					"id"=>$params[$i],
					"x"=>$params[$i+1],
					"y"=>$params[$i+2],
				);
			}

			$conds=array(
				"contentobject_attribute_id"=>$attribute_id,
			);
	
			$data = MTWhoswho::fetchList($conds);
			$db = eZDB::instance();

			$db->begin();
			foreach ($data as $d)
			{
				$flag=true;
			
				foreach ($people as $p)
				{
					if ($p["id"]==$d->attribute("source_id"))
					{
						$flag=false;
						break;
					}
				}
				
				if ($flag)
				{
					$d->remove();
				}
			}
			$db->commit();
			
			$db->begin();
			foreach($people as $p)
			{
				$w=null;
				foreach ($data as $d)
				{
					if ($d->attribute("source_id")==$p["id"])
					{
						$w = $d;
						break;
					}
				}

				if (!$w)
				{
					$w = new MTWhoswho();
				}
				
				$w->setAttribute("contentobject_attribute_id", $attribute_id);
				$w->setAttribute("source_id", $p["id"]);
				$w->setAttribute("source", $source_id);
				$w->setAttribute("x", $p["x"]);
				$w->setAttribute("y", $p["y"]);
				$w->store();
			}
			$db->commit();
		}catch(Exception $e){
			$results["errors"]=$e->getLine()." : ".$e->getFile()." : ".$e->getMessage();
		}
	}
}
?>