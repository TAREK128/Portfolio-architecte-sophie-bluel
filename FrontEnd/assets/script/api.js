const path="http://localhost:5678/api/"


async function getCategories() {
    const response = await fetch(path+"categories");
      return await response.json()};



      async function getworks() {
        const response  = await fetch (path+"works");
        return await response.json()};

        