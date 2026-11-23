export const getHealth = (req, res) => {
    req.log.info("Health endpoint accessed");
    res.status(200).json({
        success: true,
        message: "404 Archive Api is running",
    });
};
