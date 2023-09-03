const wallModel = require("../models/wallpaper");


const createWall = async(req,res)=>{

    const {imgurl, cat} = req.body; 
   
    const newWall = new wallModel({
        imgurl:imgurl,
        cat:cat
    });
    try{
        await newWall.save();
        res.status(201).json(newWall);
     } catch(error){
      console.log(error);
     res.status(500).json({message: "Something went wrong!!"});
     }

}

const getWall = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || 'timestamp';
  const sortOrder = req.query.sortOrder || 'desc';

  try {
    const totalWallpapers = await wallModel.countDocuments();

    const sortOptions = {};

    if (sortBy === 'timestamp') {
      sortOptions.timestamp = sortOrder === 'asc' ? 1 : -1;
    }

    const allWallpapers = await wallModel.find().sort(sortOptions);

    // Reverse the order of pages to achieve the opposite order
    const reversedPages = [];

    for (let i = 0; i < totalWallpapers; i += limit) {
      const startIndex = i;
      const endIndex = Math.min(i + limit, totalWallpapers);
      const pageWallpapers = allWallpapers.slice(startIndex, endIndex);
      reversedPages.unshift(pageWallpapers);
    }

    const totalPages = reversedPages.length;
    const selectedPage = Math.max(1, Math.min(page, totalPages)); // Ensure the selected page is within bounds

    res.status(200).json({
      page: selectedPage,
      totalPages,
      wallpapers: reversedPages[selectedPage - 1], // Retrieve the wallpapers for the selected page
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!!" });
  }
}
// const getCat = async (req, res) => {
//     const cat = req.query.cat; // Get category from query parameter
//     const page = parseInt(req.query.page) || 1; // Get page number from query parameter (default: 1)
//     const itemsPerPage = 10; // Number of items to display per page
  
//     try {
//       console.log(cat);
//       const totalCount = await wallModel.countDocuments({ cat });
//       const totalPages = Math.ceil(totalCount / itemsPerPage);
  
//       const documents = await wallModel
//         .find({ cat })
//         .skip((page - 1) * itemsPerPage)
//         .limit(itemsPerPage);
  
//       const imgUrls = documents.map(doc => doc.imgurl);
      
//       res.json({ imgUrls, totalPages, currentPage: page });
//     } catch (error) {
//       console.error('Error querying MongoDB:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }

const getCat = async (req, res) => {
  const cat = req.query.cat; // Get category from query parameter
  const page = parseInt(req.query.page) || 1; // Get page number from query parameter (default: 1)
  const itemsPerPage = 10; // Number of items to display per page

  try {
    console.log(cat);
    const totalCount = await wallModel.countDocuments({ cat });
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const documents = await wallModel
      .find({ cat })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .sort({ createdAt: -1 }); // Sort by createdAt timestamp in descending order

    const wallpapers = documents.map(doc => ({
      _id: doc._id,
      createdAt: doc.createdAt,
      imgurl: doc.imgurl,
      updatedAt: doc.updatedAt
    }));

    res.json({
      wallpapers,
      totalPages,
      currentPage: page,
      category: cat,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}



module.exports = {createWall, getWall,getCat};