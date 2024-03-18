const imageInput = document.querySelector('#choose-img-preview');
const imagePreviewDiv = document.querySelector('#profile-img-preview img');

if (imageInput && imagePreviewDiv) {
	imageInput.addEventListener('change', (event) => {
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = function (e) {
				imagePreviewDiv.src = e.target.result;
				// imgElement.setAttribute('width', '200');
				// imgElement.setAttribute('height', '200');
				// imagePreview.appendChild(imgElement);
			};
			reader.readAsDataURL(file);
		}
	});
}
