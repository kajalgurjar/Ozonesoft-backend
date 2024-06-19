import { db } from "../db/db.config.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ExcelJS from "exceljs";

const NewsLetter = db.newslatterData;

const postNewsLetter = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(403, "Please enter an email address");
  }
  const newsLetterObject = {
    email,
  };
  if (!newsLetterObject) {
    throw new ApiError(403, "Object not created");
  }
  const data = await NewsLetter.create(newsLetterObject);

  return res
    .status(200)
    .json(new ApiResponse(200, { data }, "email send Successfully"));
});
const getNewsLetter = asyncHandler(async (req, res) => {

  const newsLetterData = await NewsLetter.findAll();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { newsLetterData },
        "NewsLetter data sent successfully"
      )
    );
});

const downloadNewsLetter = asyncHandler(async (req, res) => {
  const newsLetterData = await NewsLetter.findAll();

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("NewsLetter Data");

  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Email", key: "email", width: 30 },
    { header: "Created At", key: "createdAt", width: 30 },
  ];

  newsLetterData.forEach((data) => {
    worksheet.addRow(data.toJSON());
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=newsletter.xlsx");

  await workbook.xlsx.write(res);
  res.end();
});




export { postNewsLetter, getNewsLetter, downloadNewsLetter };