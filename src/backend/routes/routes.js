import express from "express";
import {google} from "googleapis"
import multer from "multer"
const routes = express.Router();
import path from "path";
import fs from "fs"
import axios from "axios"



const spreadsheetId = "1EIeDEO0kbJd36p3Xk0hhLNPjuC1j2Iv0Wey4qTwyrCg";
const auth = new google.auth.GoogleAuth({
    keyFile:"credentials.json",
    scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive.metadata.readonly",
        "https://www.googleapis.com/auth/drive.appdata"
    ]
});

const client = await auth.getClient();

const sheets = google.sheets({version:"v4",auth:client});
const drive = google.drive({ version: "v3", auth: client });


async function getOrCreateFolder(parentFolderId, folderName) {
    try {
        const response = await drive.files.list({
            q: `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
            fields: "files(id, name)",
        });

        if (response.data.files.length > 0) {
            console.log(`Folder "${folderName}" exists with ID: ${response.data.files[0].id}`);
            return response.data.files[0].id;
        }


        const fileMetadata = {
            name: folderName,
            mimeType: "application/vnd.google-apps.folder",
            parents: [parentFolderId],
        };

        const folder = await drive.files.create({
            resource: fileMetadata,
            fields: "id",
        });

        console.log(`Folder "${folderName}" created with ID: ${folder.data.id}`);
        return folder.data.id;
    } catch (error) {
        console.error("Error in getOrCreateFolder:", error);
        throw error;
    }
}

// Example usage
const parentFolderId = "14NNAgpMkqYSsMad2MXhhSOI2LZPIdWx_";


routes.get("/get",async (req,res)=>{
    const rows =await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range:"s1!A:D"
    })
    res.status(200).json(rows)    
})
routes.get("/getall",async (req,res)=>{
    const rows =await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range:"s1!A:O"
    })
    res.status(200).json(rows)    
})

routes.post("/update",async (req,res)=>{
    let db=[];
    const rows =await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range:"s1!A:B"
    })
    let rowval = rows.data.values
    rowval = rowval.slice(1);
    for(let i of rowval){
        if(i[1]===req.body.registerNumber){
            db=[...db,i[0]];
            break
        }
    }
    db=[...db,req.body.registerNumber,req.body.name,req.body.title,req.body.mobileNo,"","","",req.body.startDate,req.body.endDate,req.body.companyName,req.body.placementType,req.body.stipend,req.body.researchIndustry];
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range:`s1!A${parseInt(db[0])-1}:N${parseInt(db[0])-1}`,
        valueInputOption:"RAW",
        resource:{values:[db]}
    })
    
})
// Set up multer for file upload
const upload = multer({ dest: "uploads/" }); // Store uploaded files temporarily

routes.post("/verify", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Step 1: Get extracted data from Flask server
    const resp = await axios.get("http://127.0.0.1:5001/extracteddata");

    // Step 2: Check data in the spreadsheet
    const rows = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "s1!A:T",
    });

    let found = false;
    let folderId = null;
    for (let i of rows.data.values) {
      if (
        i[1] === resp.data["Register Number"] &&
        i[4] === resp.data["Mobile Number"] &&
        resp.data["Company"].includes(i[10])
      ) {
        found = true;

        // Step 3: Get or create the folder
        const folderName = `${resp.data["Register Number"]}_${resp.data.Name}`;
        folderId = await getOrCreateFolder(parentFolderId, folderName);

        break;
      }
    }

    if (!found) {
      return res.json({ message: "no" });
    }

    // Step 4: Upload file to Google Drive folder
    const fileMetadata = {
      name: `${resp.data["Register Number"].slice(9)}-Permission Letter.pdf`,
      parents: [folderId],
    };
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    const fileUpload = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    fs.unlinkSync(req.file.path);

    return res.json({
      message: "yes",
      folderId: folderId,
      fileId: fileUpload.data.id,
    });

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to process verification and file upload" });
  }
});

export default routes
