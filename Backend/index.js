$('#filtres li').click(function(){
	// on recupère la valeur du filtre
	value = $(this).data('filter');
	// on enlève la classe active de l'ancien élément
	$('#filtres li').removeClass('active'),
	// on ajoute la classe active sur l'élément cliqué
	$(this).addClass('active');

	// pour chaque div 
	$('#elements div').each(function(){
		el = $(this);
		// on montre tout
		el.show();
		// on teste si l'élément n'a pas la classe du filtre ou que l'utilisateur ne souhaite pas tout affiché
		if(!el.hasClass(value) && value != "all" )
			el.hide(); // on cache les éléments qu'on ne souhaite pas voir

	});
});