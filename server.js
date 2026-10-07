const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const NEXA_API = "https://api.nexadev.my.id";

/* =================================
   HOME
================================= */

app.get("/", (req, res) => {
    res.json({
        name: "AltharMultiverse API",
        status: "online"
    });
});

/* =================================
   AM PRESET
================================= */

app.get("/api/ampreset", async (req, res) => {

    const url = req.query.url;

    if (!url) {
        return res.status(400).json({
            ok: false,
            message: "URL TikTok belum diberikan."
        });
    }

    try {

        const apiUrl =
            `${NEXA_API}/api/ampreset?url=${encodeURIComponent(url)}`;

        const response =
            await fetch(apiUrl);

        const data =
            await response.json();

        res
            .status(response.status)
            .json(data);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            message: "Gagal menghubungi Nexa API.",
            error: error.message
        });

    }
});

/* =================================
   AIO DOWNLOADER
================================= */

app.get("/api/aio", async (req, res) => {

    const url = req.query.url;

    if (!url) {
        return res.status(400).json({
            status: false,
            message: "URL TikTok belum diberikan."
        });
    }

    try {

        const apiUrl =
            `${NEXA_API}/api/aio?url=${encodeURIComponent(url)}`;

        const response =
            await fetch(apiUrl);

        const data =
            await response.json();

        res
            .status(response.status)
            .json(data);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            status: false,
            message: "Gagal menghubungi AIO API.",
            error: error.message
        });

    }
});

/* =================================
   BRAT CANVAS
================================= */

app.get("/api/brat", async (req, res) => {

    const text = req.query.text;

    if (!text) {
        return res.status(400).json({
            status: false,
            message: "Teks belum diberikan."
        });
    }

    try {

        const apiUrl =
            `${NEXA_API}/api/canvas/brat?text=${encodeURIComponent(text)}`;

        const response =
            await fetch(apiUrl);

        const contentType =
            response.headers.get("content-type") || "";

        if (!response.ok) {

            return res.status(response.status).json({
                status: false,
                message: "Gagal membuat gambar Brat."
            });

        }

        /* Jika API mengembalikan gambar */

        if (contentType.includes("image")) {

            const buffer =
                await response.arrayBuffer();

            res.set(
                "Content-Type",
                contentType
            );

            return res.send(
                Buffer.from(buffer)
            );

        }

        /* Jika API mengembalikan JSON */

        const data =
            await response.json();

        res.json(data);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            status: false,
            message: "Gagal menghubungi Brat API.",
            error: error.message
        });

    }
});

// =================================
// IMAGE UPSCALER
// =================================

app.get("/api/upscale", async (req, res) => {

    try {

        const { url, resolusi } = req.query;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL gambar wajib diisi."
            });
        }

        const response = await fetch(
            `https://api.nexadev.my.id/api/upscale1?url=${encodeURIComponent(url)}&resolusi=${encodeURIComponent(resolusi || "2")}`
        );

        if (!response.ok) {

            return res.status(response.status).json({
                success: false,
                message: "Gagal melakukan upscale."
            });

        }

        const contentType =
            response.headers.get("content-type") ||
            "image/png";

        const buffer =
            Buffer.from(
                await response.arrayBuffer()
            );

        res.setHeader(
            "Content-Type",
            contentType
        );

        res.send(buffer);

    } catch (error) {

        console.error(
            "Upscale Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error."
        });

    }

});

// =================================
// TOOL 005 — FAKE FREE FIRE V2
// =================================

app.get("/api/fakeff", async (req, res) => {

    try {

        const { usn } = req.query;

        if (!usn) {
            return res.status(400).json({
                success: false,
                message: "Nickname Free Fire wajib diisi."
            });
        }

        const apiUrl =
            `https://apii.nexadev.my.id/fakeff?usn=${encodeURIComponent(usn)}`;

        const response =
            await fetch(apiUrl);

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                message: "Gagal membuat mockup Free Fire."
            });
        }

        const contentType =
            response.headers.get("content-type") ||
            "image/jpeg";

        const buffer =
            Buffer.from(
                await response.arrayBuffer()
            );

        res.status(200);
        res.setHeader(
            "Content-Type",
            contentType
        );

        res.setHeader(
            "Cache-Control",
            "public, max-age=3600"
        );

        return res.send(buffer);

    } catch (error) {

        console.error(
            "FakeFF Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error.",
            error: error.message
        });

    }

});

/* =================================
   VERCEL EXPORT
================================= */

module.exports = app;
