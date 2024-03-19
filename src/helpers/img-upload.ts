import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { CustomSession } from '../interfaces/CustomSession';

const createUserDirectory = (userId: string) => {
	const userDirectory = path.join(
		__dirname,
		'..',
		'..',
		'public',
		'img',
		'users',
		userId
	);
	if (!fs.existsSync(userDirectory)) {
		fs.mkdirSync(userDirectory, { recursive: true });
	}
	return userDirectory;
};

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const userId = (req.session as CustomSession).user!.id;
		const userDirectory = createUserDirectory(userId);
		cb(null, userDirectory);
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		const randomFileName = crypto.randomBytes(16).toString('hex');
		cb(null, randomFileName + '-' + Date.now() + ext);
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 1024 * 1024 * 5 },
	fileFilter: function (req, file, cb) {
		const allowedTypes = ['image/jpeg', 'image/png'];
		if (!allowedTypes.includes(file.mimetype)) {
			cb(null, false);
		} else {
			cb(null, true);
		}
	},
}).single('image');

export default upload;
