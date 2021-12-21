
const bookModel = require("../models/bookModel")
const validator = require("../validators/validator")
const awsconfig = require("../awsconfig/awsconfig")





//Book creation..........
const createBook = async function (req, res) {

    try {
        let requestBody = req.body;

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ ststus: false, message: `Empty body not accepted.` })
        }

        const { title, excerpt, ISBN, category, subcategory, releasedAt, bookCoverLink } = requestBody

        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, message: "Title must be present" })
        };

        if (!validator.isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "Excerpt must be present" })
        };     

        if (!validator.isValid(ISBN)) {
            return res.status(400).send({ status: false, message: "ISBN must be present" })
        };
        if (!validator.isValid(category)) {
            return res.status(400).send({ status: false, message: "Category must be present" })
        };
        if (!validator.isValid(subcategory)) {
            return res.status(400).send({ status: false, message: "Subcategory must be present" })
        };
        if (!validator.isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: "releasedAt must be present" })
        };
        if (!validator.isValid(bookCoverLink)) {
            return res.status(400).send({ status: false, message: "Bookcover Link must be present" })
        };

        const titleAlreadyUsed = await bookModel.findOne({ title: title })
        if (titleAlreadyUsed) {
            return res.status(400).send({ status: false, message: "Title is already used. Please provide a unique title." })
        }

        const isbnAlreadyUsed = await bookModel.findOne({ ISBN: ISBN });
        if (isbnAlreadyUsed) {
            return res.status(400).send({ status: false, message: "ISBN is already used. Please provide a unique ISBN." })
        }

        const newBook = await bookModel.create(requestBody);
        return res.status(201).send({ status: true, message: "Book created successfully", data: newBook })


    } catch (err) {
        return res.status(500).send({ status: false, message: "Something went wrong", Error: err.message })
    }
}


const addLink = async function (req, res) {
    try {
        let files = req.files;
        if (files && files.length > 0) {
          //upload to s3 and return true..incase of error in uploading this will goto catch block( as rejected promise)
          let uploadedFileURL = await uploadFile( files[0] ); // expect this function to take file as input and give url of uploaded file as output 
          res.status(201).send({ status: true, data: uploadedFileURL });
    
        } 
        else {
          res.status(400).send({ status: false, msg: "No file to write" });
        }
    
      } 
      catch (e) {
        console.log("error is: ", e);
        res.status(500).send({ status: false, msg: "Error in uploading file to s3" });
      }
}


module.exports = {
    createBook,
    addLink
    
}