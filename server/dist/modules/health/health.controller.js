export const getHealth = (req, res) => {
    res.status(200).json({
        success: true,
        message: "404 Archive Api is running",
    });
};
