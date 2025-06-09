import express from "express";
import {google} from "googleapis"
import multer from "multer"
const routes = express.Router();
import path from "path";
import fs from "fs"
import axios from "axios"

const auth = new google.auth.GoogleAuth({
    keyFile:"credentials.json",
    scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive.metadata.readonly",
        "https://www.googleapis.com/auth/drive.appdata"
    ]
});

const client = await auth.getClient();
const drive = google.drive({ version: "v3", auth: client });

async function getOrCreateFolder(parentFolderId, folderName) {
    try {
        // Step 1: Check if folder exists
        const response = await drive.files.list({
            q: `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
            fields: "files(id, name)",
        });

        if (response.data.files.length > 0) {
            console.log(`Folder "${folderName}" exists with ID: ${response.data.files[0].id}`);
            return response.data.files[0].id;
        }

        // Step 2: Create folder if not found
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
getOrCreateFolder(parentFolderId, "def").then((folderId) => {
    console.log("Final Folder ID:", folderId);
});
