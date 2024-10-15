const express = require("express")
const app = express();

const {initializeData} = require("./db/db.connect")
const Recipe = require("./models/recipe.models")

app.use(express.json())

initializeData()

// const newRecipe = {
//     "title": "Spaghetti Carbonara",
//     "author": "Sanjeev Kapoor",
//     "difficulty": "Intermediate",
//     "prepTime": 20,
//     "cookTime": 15,
//     "ingredients": [
//       "200g spaghetti",
//       "100g guanciale or pancetta, diced",
//       "2 large eggs",
//       "50g grated Pecorino Romano cheese",
//       "Salt and black pepper to taste"
//     ],
//     "instructions": [
//       "Cook the spaghetti in boiling salted water until al dente.",
//       "Meanwhile, sauté the guanciale or pancetta until crispy.",
//       "In a bowl, whisk together eggs and grated cheese.",
//       "Drain the spaghetti and immediately toss with the egg mixture and cooked guanciale/pancetta.",
//       "Season with salt and pepper. Serve immediately."
//     ],
//     "imageUrl": "https://example.com/spaghetti_carbonara.jpg"
//   }



async function createRecipe(newRecipe){
  try{
    const recipe = new Recipe(newRecipe)
    const saveRecipe = await recipe.save()
    return saveRecipe
  }catch(error){
    throw error
  }
}

//createRecipe(newRecipe)

async function readAllRecipes() {
     try{
       const allRecipes = await Recipe.find()
       return allRecipes
     }catch(error){
        throw error
     }
}

app.get("/recipes", async(req, res)=>{
    try{
       const recipes = await readAllRecipes()
       if(recipes.length!=0){
          res.json(recipes)
       }else{
          res.status(404).json({error:'NO Recipes found'})
       }
    }catch(error){
        res.status(500).json({message: 'failed to fetch recipes'})
    }
})

app.post("/recipes", async(req, res)=>{
    try{
      const savedRecipe = await createRecipe(req.body)
      res.status(201).json({message: 'Recipe added successfully', recipe:savedRecipe})
    }catch(error){
        res.status(500).json({error: 'Failed to add recipe'})
    }
})


async function readRecipeByTitle(recipeTitle){
    try{
        const recipe = await Recipe.findOne({title: recipeTitle})
        return recipe
    }catch(error){
        throw error
    }
}

app.get("/recipes/:title", async(req, res)=>{
    try{
       const recipe = await readRecipeByTitle(req.params.title)
       if(recipe.length!=0){
        res.json(recipe)
       }else{
        res.status(404).json({error:'NO recipe found'})
       }
    }catch(error){
        res.status(500).json({error: 'Failed to fetch recipes'})
    }
})


async function readByAuthor(authorName){
    try{
      const recipe = await Recipe.findOne({author: authorName })
      return recipe
    }catch(error){
        throw error
    }
}

app.get("/recipes/author/:authorName", async(req, res)=>{
    try{
      const recipe = await readByAuthor(req.params.authorName)
      if(recipe.length!=0){
        res.json(recipe)
      }else{
        res.status(404).json({error: 'No Recipe found'})
      }
    }catch(error){
        res.status(500).json({error: 'Failed to fetch recipes'})
    }
})


async function readRecipeDifficulty(recipeLevel){
   try{
      const recipe = await Recipe.find({difficulty: recipeLevel})
      return recipe
   }catch(error){
    throw error
   }
}

app.get("/recipes/difficulty/:level", async(req, res)=>{
  try{
    const recipe =  await readRecipeDifficulty(req.params.level)
    if(recipe.length!=0){
      res.json(recipe)
    }else{
      res.status(404).json({error: 'No recipe found'})
    }

  }catch(error){
    res.status(500).json({error:'failed to fetch recipes'})
  }
})

async function updateRecipe(recipeId, dataToUpdate){
  try{
     const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate,{new: true})
     return updatedRecipe
  }catch(error){
    console.log("Error in updating Recipe")
  }
}


app.post("/recipes/:recipeId", async(req, res)=>{
  try{
     const updatedRecipe = await updateRecipe(req.params.recipeId, req.body)
     if(updatedRecipe){
      res.status(200).json({message:'Recipe updated successfully'})
     }else{
      res.status(404).json({error: 'Recipe Not found'})
     }
  }catch(error){
    res.status(500).json({error: 'failed to update recipe'})
  }
})

async function updateRecipeByTitle(recipeTitle, dataToUpdate){
   try{
      const updatedRecipe = await Recipe.findOneAndUpdate({title: recipeTitle}, dataToUpdate, {new: true})
      return updateRecipe
   }catch(error){
    console.log("Error while updating Recipe")
   }
}

app.post("/recipes/title/:recipeTitle", async(req, res)=>{
  try{
     const updatedRecipeTitle = await updateRecipeByTitle(req.params.recipeTitle, req.body)
     if(updatedRecipeTitle){
        res.status(200).json({message: 'Recipe updated successfully'})
     }else{
        res.status(404).json({error: 'Recipe not found'})
     }
  }catch(error){
    res.status(500).json({error: 'Failed to updated Recipe'})
  }
})



async function deleteRecipe(recipeId){
 try{
     const deleteRecipe = await Recipe.findByIdAndDelete(recipeId)
     return deleteRecipe
 }catch(error){
   console.log("Error while deleting recipe")
 }
}

app.delete("/recipes/:recipeId", async(req, res)=>{
  try{
    const deletedRecipe =  await deleteRecipe(req.params.recipeId)
    if(deletedRecipe){
      res.status(200).json({message: 'Recipe deleted successfully'})
    }else{
      res.status(404).json({error: "Recipe not found"})
    }
  }catch(error){
    res.status(500).json({error: 'failed to delete Recipe'})
  }
})

const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})


