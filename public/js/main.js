$(document).ready(function() {
	$('.deleteUser').on('click', deleteUser);
});

function deleteUser() {
	var confirmation = confirm("Are you sure?");

	if (confirmation) {
		$.ajax({
			type: 'DELETE',
			url: '/users/delete/' + $(this).data('id')
		});
		
		window.location.replace('/');
	} else {
		return false;
	}
}