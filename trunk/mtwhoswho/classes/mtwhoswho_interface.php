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
interface MTWhoswhoInterface
{
	public function getName($source_id, $source);
	public function getListOf($contentobject_attribute_id, $source);
}
?>