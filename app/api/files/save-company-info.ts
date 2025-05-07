import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mhrgktbewfojpspigkkg.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, address, phone, pdfFileName, file } = req.body;

    if (!name || !address || !phone || !pdfFileName || !file) {
      return res.status(400).json({ error: "All fields are required." });
    }

    try {
      // Save company info to the database
      const { data, error } = await supabase.from("company_info").insert([
        {
          name,
          address,
          phone,
          pdf_file_name: pdfFileName,
          file,
        },
      ]);

      if (error) {
        throw error;
      }

      return res.status(200).json({ message: "Company info saved successfully.", data });
    } catch (error) {
      console.error("Error saving company info:", error);
      return res.status(500).json({ error: "Failed to save company info." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}