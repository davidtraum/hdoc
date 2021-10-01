## Syntax

### Elements

* `hr`
  * Adds a horizontal line
* `h1 Hello World`
  * Creates a h1 headline saying hello world
* `h1.red.shadow Hello World` 
  * Creates a headline saying hello world with "red" and "shadow" CSS-Class
* `h1.red [title=My Headline, id=headline] Hello World`
  * Creates a headline saying hello world with "red" CSS-Class and title + id attributes.
  * 
#### Shortcuts

* `.red`
  * No tag name creates a div with css class red
* `..red`
  * No tag name + two dots creates a span with css class red

#### Tree

`
h1 Hello World
hr
ul
  li A list entry
  li Another list entry
  ul
    li Sub-List
p No list
`

=> Elements with more indent will be children of the element before with lower indentation.

#### Text

div
  This text is included
  in the div
  with multiple lines

=> Text that does not start with a tag-name will be interpreted as plain text.


### External files

#### Add CSS
\# path/to/myfile.css

=> Imports a css file

#### Add JavaScript
\> path/to/myfile.js

=> Imports a js file

#### Include hdoc-Files
& /path/to/myfile.hdoc
or
& /path/to/myfile

=> Inserts content of a hdoc file.

### Libraries
Libraries a predifined collections of additional files.

@ library-name

=> Adds a library.

#### Available libraries:
@bootstrap | Default bootstrap
@litera | BootSwatch Litera theme (Modern look)
@darkly | BootSwatch Darkly theme (Dark look)
@sketchy | BootSwatch Sketchy theme (Sketchy look)
@lux | BootSwatch Lux theme (Modern look)

### Settings
Settings can modify the document and the build process.
Assigning settings works like this:

$setting = value

#### Available settings:

|Setting|Description|Values|Default|
|-|-|-|
|$verbose|Enables detailed log messages when building the document|true / false|false|
|$centered|Sets if the document content is centered on big screens|true / false|true|
|$title|The title of the HTML-Document. Appears in the browser-tab.|Any text|Document|
|$documentClass|CSS-Classes that get applied to the document container|CSS Classes seperated by spaces|Empty|
|$basePath|A directory path where the compiler looks for included .hdoc files.|A file path|Empty (current directory)|

