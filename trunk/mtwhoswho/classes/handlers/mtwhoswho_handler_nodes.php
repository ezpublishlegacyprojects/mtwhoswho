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
include_once("extension/mtwhoswho/classes/mtwhoswho_interface.php");
class MTWhoswhoHandlerNodes implements MTWhoswhoInterface
{
	public function getName($source_id, $extra_params)
	{
		$node=eZContentObjectTreeNode::fetch($source_id);
		
		$source = $extra_params["source"];
		$class_identifier = $node->attribute("class_identifier");
		
		if (isset($source["ClassAttributeMapping"]) and isset($source["ClassAttributeMapping"][$class_identifier]))
		{
			$identifiers = explode(";",$source["ClassAttributeMapping"][$class_identifier]);
			$data_map = $node->dataMap();
			$name="";
			foreach ($identifiers as $i)
			{
				$name .= $data_map[$i]->content()." ";	
			}
			$name = trim($name);
		}
		else
		{
			$name = $node->attribute("name");
		}

		return $name;
	}
	
	public function getListOf($contentobject_attribute_id, $source)
	{
		$results=array();
		$parent_node=eZContentObjectTreeNode::fetch($source["ParentNodeID"]);
				
		$params = array( 
			'Depth'                    => false,
			'Offset'                   => false,
		//	'OnlyTranslated'           => false,
			'Language'                 => false,
			'Limit'                    => false,
			'SortBy'                   => array('name', false),
			'AttributeFilter'          => false,
			'ExtendedAttributeFilter'  => false,
			'ClassFilterType'          => false,
			'ClassFilterArray'         => false,
			'GroupBy'                  => false,
			'Limitation'			   => array() 
		);
		
		if (isset($source["ClassFilter"]))
		{
			$params["ClassFilterType"]="include";
			$params["ClassFilterArray"]=$source["ClassFilter"];
		}
		
		$nodes=$parent_node->subTree($params);
		if (count($nodes)==0)
		{
			throw new Exception("There is no content in this parent node.");
		}

		foreach($nodes as $n)
		{
			if (isset($source["ClassAttributeMapping"]) and isset($source["ClassAttributeMapping"][$class_identifier]))
			{
				$identifiers = explode(";",$source["ClassAttributeMapping"][$class_identifier]);
				$data_map = $n->dataMap();
				$name="";
				foreach ($identifiers as $i)
				{
					$name .= $data_map[$i]->content()." ";	
				}
				$name = trim($name);
			}
			else
			{
				$name = $n->attribute("name");
			}
			$results[]=array("id" => $n->attribute("node_id"), "name"=>$name);
		}
		return $results;
	}
}

?>