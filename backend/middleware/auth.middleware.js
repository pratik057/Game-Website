import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    try {
        const token = req.header("authorization");
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = verified.id;
        next();
    } catch (err) {
        res.status(500).json(err);
    }
}
export default auth;