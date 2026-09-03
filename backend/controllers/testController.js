const testController = (req, res) => {
    res.json({
        success: true,
        message: "REST API is working"
    });
};

module.exports = testController;