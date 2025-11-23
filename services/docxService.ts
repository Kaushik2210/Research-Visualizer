// Access global Mammoth library loaded via script tag
declare const mammoth: any;

export const extractTextFromDocx = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    
    if (!result || !result.value) {
        throw new Error("No text content found in DOCX file.");
    }
    
    return result.value;
  } catch (error) {
    console.error("Error parsing DOCX:", error);
    throw new Error("Failed to extract text from DOCX. Please ensure it is a valid Word document.");
  }
};