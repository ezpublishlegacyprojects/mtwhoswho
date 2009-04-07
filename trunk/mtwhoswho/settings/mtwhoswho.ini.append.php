<?php /*
[MainSettings]
SquareSize=100
BorderWidth=
BorderColor=#005493


[eZCoreSettings]
#Level allow you to compress or not the different javascript used in your project.
#For more information refer to the INSTALL document.
Level=0


[ContentSettings]
#Sources that will be used to fill the list
#The declaration is made by
#Sources[<content class id>]=<source identifier>
#For the source identifier, you can use nodes|data
Sources[]
Sources[30]=nodes
Sources[34]=data


#The nodes source is providing content node data to fill the list
[Source_nodes]
#Id of the node containing the content nodes 
ParentNodeID=12


#Class filters are used to filter the nodes
#If not set, all children nodes will be used
#ClassFilter[]=<class identifier>
ClassFilter[]
ClassFilter[]=user


#Class attribute mappings set the class attribute to use during the content fetch
#You can specify several attributes for one class
#If not set, the default name will be used
#For example, if you set first_name and last_name for the class User
#People in the list get names like Barack OBAMA.
#ClassAttributeMapping[<class identifier>][]=<class attribute identifier>;[<class attribute identifier>]
ClassAttributeMapping[]
ClassAttributeMapping[user]=first_name;last_name


[Source_data]
#MaxLength is the maximum length of one name of the list
MaxLength=100

*/
?>