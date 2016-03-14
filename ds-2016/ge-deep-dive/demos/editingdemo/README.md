Editing Demo App
=========

This application is being prepared for the DevSummit Talk on the GeometryEngine


Current Plan is to have an App that

- Add
- Append (union)
- Subtract (Difference)
- Merge (union)
- Split (Difference
- Effects
  - Buffer
  - Rotate 
- Footer Tool - Measure
  - Shows Dimensions using Offset
  
  There will be a file under www/js/operations  which has the logic for each of these commands. This should make it easy to show and explain how the GeometryEngine is being used to achieve the functionality.
  
  
  
  
  ## Getting Started
  
  To get the app running on another development machine:
  
  1. Ensure NPM is available on the machine. This can be achieved by installing node.js
  2. Start a command prompt, navigate to the root of this repository, and run the following command:
  ```
  npm install
  ```
  3. Ensure a Web Server, is configured and points to the www folder.
  4. Launch http://localhost/editing-demo/index.html   (or the URL and domain you have setup)
  
  
  Whilst developing, it maybe convenient to run the following command:
  ```
  grunt observe
  ```
  This watches for changes in .less and .ts files, and recompiles the LESS and Typscript files.
  
  
   


