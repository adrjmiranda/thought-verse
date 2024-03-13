import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/thoughtverse';

async function main() {
	await mongoose
		.connect(MONGODB_URI)
		.then(() => {
			console.log('Connected to the database successfully!');
		})
		.catch((error) => console.log(error));
}

main();

export default mongoose;
