function getConsole() {
    if (typeof window !== "undefined") {
      return window.console;
    }
    return global.console;
  }
  const console = getConsole();
  
  function cached(fn) {
    const cache = Object.create(null);
    return function cachedFn(str) {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  }
  
  const regex = /-(\w)/g;
  const camelize = cached(str =>
    str.replace(regex, (_, c) => (c ? c.toUpperCase() : ""))
  );
  
  function removeNode(node) {
    if (node.parentElement !== null) {
      node.parentElement.removeChild(node);
    }
  }
  
  function insertNodeAt(fatherNode, node, position) {
    const refNode =
      position === 0
        ? fatherNode.children[0]
        : fatherNode.children[position - 1].nextSibling;
    fatherNode.insertBefore(node, refNode);
  }
  function uploadImageBase64(file,isArray) {
    if(isArray){
      var Images =[]
      file.forEach((element,i) => {
        Images[i]= new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(element);
          fileReader.onload = (res) => {
            console.log("result",res.target.result);
            resolve(res.target.result);
          };
          fileReader.onerror = (err) => reject(err);
        });

      });
      console.log("image",Promise.all(Images));
        return Promise.all(Images)
    }
    else if (file[0]) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file[0]);
        fileReader.onload = (res) => {
          resolve(res.target.result);
        };
        fileReader.onerror = (err) => reject(err);
      });
    } else {
      return null;
    }
    
  }
  function  imageNotFound(e) {
    e.target.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDWHK7d1GnyAFK9mQgc6jOEmT8e3cmMfgLA_MZu2OPJK6Q_tNyvG4Z3xh6jZIVzXDAOZ0&usqp=CAU";
  }

  
  export { insertNodeAt, camelize, console, removeNode,uploadImageBase64,imageNotFound};
  
