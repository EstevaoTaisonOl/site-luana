import jwt from "jsonwebtoken";

export function generateToken(uuid) {
    const token = jwt.sign(
        { uuid }, // payload
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
    );

    return token
}

export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { valid: true, uuid: decoded.uuid };
    } catch (err) {
        return { valid: false, error: err.message };
    }
}