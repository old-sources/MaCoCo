Ext.define('ExtJsMVC.view.cursus.detailCursus.DetailCursusGlobalViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.DetailCursusGlobalViewController',
    init: function()
	{
		//this.draggedItem;
    	
		this.control
		({
			'cursusViewGrid dataview' : 
			{
				drop : this.dragdrop,
			
			},
			         
		});
		
	},
	
	

	
dragdrop : function(node,data,overModel,dropPosition,eOpts){
		
		var coursStore = this.getViewModel().getStore('coursByCursus');
		
		coursStore.each(function(element, index, array){
				element.set('cocOrdre',index+1);	
		});
		
		coursStore.sync({
			failure : function(batch){
    			var message = batch.operations[0].error.response.responseText;
    			Ext.Msg.alert('Erreur', message);
    		}
		}); 
		
	},
	onAddUfCursusClick : function()
	{
		var vm = this.getViewModel();
		var itemSelected =vm.get('currentSecondTreeItem');
    		
		//création d'un objet "uf id" à partir de l'id de l'uf selectionnée
    	var parent = {curId : itemSelected.get('curId')};
		//création d'une nouvelle unite de formation avec insertion ddu cursus pour garder l'arborescence
    	var newChild = Ext.create('ExtJsMVC.model.cursus.UniteFormationCursusModel');
		newChild.set ('cursus', parent);
		newChild.parentNode = itemSelected;			
			
		var myStore = vm.getStore('ufStore');
		
		// insertion de l'item dans le store;
    	var record = myStore.insert(0,newChild)[0];
		
    	// selection de l'item en cours de création
		var secondTree = Ext.ComponentQuery.query('cursus-Arbre2')[0];
    	secondTree.getSelectionModel().select(record);

	},
	onAddPromoClick : function()
	{
		var vm = this.getViewModel();
		var itemSelected =vm.get('currentCursus'); 
		
		//création d'un objet "cursus id" à partir de l'id du cursus selectionné
    	var parent = {curId : itemSelected.get('curId')};
		
    	//création d'une nouvelle promotion avec insertion du cursus pour garder l'arborescence
    	var newChild = Ext.create('ExtJsMVC.model.promotion.FirstTreePromotionModel');
		newChild.set ('cursus', parent);
		newChild.parentNode = itemSelected;
		var myStore = vm.getStore('firstTreePromoStore');
		
		// insertion de l'item dans le store;
    	var record = myStore.insert(0,newChild)[0];
    	
    	// selection de l'item en cours de création
		var firstTree = Ext.ComponentQuery.query('cursus-Arbre')[0];
		firstTree.getSelectionModel().select(record);
		
		var switchview = Ext.ComponentQuery.query('#switchView')[0];
		if(switchview.getChildEls())
 	   {
	    	   switchview.removeAll();
 	   }
	       switchview.add({xtype : 'promo-DetailNewPromo'});
	},

	onAddPeriodeCursusClick : function()
	{
		var vm = this.getViewModel();
		var itemSelected =vm.get('currentCursus'); 
		
		//création d'un objet "cursus id" à partir de l'id du cursus selectionné
    	var cursus = {curId : itemSelected.get('curId')};
    	//création d'une nouvelle période 
    	var newChild = Ext.create('ExtJsMVC.model.cursus.PeriodeCursusModel');
		newChild.set ('cursus', cursus);
		
		var myStore = vm.getStore('periodeStore');
		
		// insertion de l'item dans le store;
    	var record = myStore.insert(0,newChild)[0];
    	
    	// selection de l'item en cours de création
		var periodeGrid = Ext.ComponentQuery.query('cursus-periodeGrid')[0];
		periodeGrid.getSelectionModel().select(record);
		
		var switchview = Ext.ComponentQuery.query('#switchView')[0];
		switchview.removeAll();
		switchview.add({xtype : 'cursus-DetailPeriode'});
	},

	getInfo : function(view, row, col, action, ev, record){
		console.log(record);
	},
	
	onPrintClick : function(bouton) {

		var uniteFormationStore = this.getViewModel().getStore('rootCursuses');
		var cursus = uniteFormationStore.getRoot().getChildAt(0);
		var cursusData = cursus.pseudoWriting();

		var periodeStore = this.getViewModel().getStore('periodeSchemaStore');
		var myUrl = './webapi/periode/schemapedagogique/'.concat(cursusData.curId);
		periodeStore.load({
			url : myUrl,
			callback : function(periodeData){
				console.log('periode');
				console.log(periodeData);
				if (periodeData.length===0){
					Ext.Msg.alert('Opération interdite', 'Avant d\'imprimer, veuillez ajouter une période au cursus.');
				}else{
					
				var drawDocument = function() {

					var htmlBody = this.document.body;

					var dh = Ext.DomHelper;

					// nom document
					var today = new Date();
					var day = today.getDate();
					var month = today.getMonth() + 1;
					if (month < 10) {
						month = '0' + month;
					}
					var year = today.getFullYear();
					var dateToday = day + '/' + month + '/' + year;
					var documentName = 'Schema Pédagogique : ' + cursusData.curNom
							+ ' | ' + dateToday;
					this.document.title = documentName;
					periodeData.forEach(function(periode){
					
						console.log('periode');
						console.log(periode);
						// Ajout dans un tableau pour la mise en page
					var child = {
						tag : 'table',
						cls : 'bloc-table'
					};
					var blocTable = dh.append(htmlBody, child);
					var child = {
						tag : 'thead',
						cls : 'bloc-tableHead'
					};
					var blocTableHead = dh.append(blocTable, child);
					var child = {
						tag : 'tr',
						cls : 'bloc-tableRowHead'
					};
					var blocTableRowHead = dh.append(blocTableHead, child);
					var child = {
						tag : 'th',
						cls : 'bloc-tableH'
					};
					var blocTableH = dh.append(blocTableRowHead, child);

					//image
					var child = {
							tag : 'image',
							src : 'img/imie.jpeg'
					}
					var image = dh.append(blocTableH, child);
					// Titre
					//var schemaPedago = 'Schéma pédagogique : ';
					var child = {
						tag : 'div',
						cls : 'bloc-titre',
						//html : schemaPedago.concat(periode.cursus.curNom)
					};
					var blocTitre = dh.append(blocTableH, child);
					var schemaPedago = 'Schéma pédagogique : ';
					var child = {
						tag : 'span',
						cls : 'span-titre',
						width : '60%',
						html : schemaPedago.concat(periode.getData().cursus.curNom)
					};
					var Titre = dh.append(blocTitre, child);
					var perHtml = (periode.getData().perNom)//.concat(' : ').concat.(periode.getData().perNbjours).concat('j');
					var child = {
							tag : 'span',
							cls : 'span-periode',
							width : '30%',
							html : perHtml
						};
					var Titre = dh.append(blocTitre, child);

					// Nom des colonnes
					var child = {
						tag : 'div',
						cls : 'bloc-columnName'
					};
					var blocColumnName = dh.append(blocTableH, child);

					var columnName = [ [ 'Compétences Visées', 'column-reac' ],
							[ 'Modules', 'column-module' ],
							[ 'Jours', 'column-jour' ],
							[ 'Heures', 'column-heure' ],
							[ 'Evaluations', 'column-infoeval' ],
							[ 'Commentaires', 'column-infomodule' ] ];

					columnName.forEach(function(element, index, array) {
						var child = {
							tag : 'div',
							cls : element[1],
							html : element[0]
						};
						var column = dh.append(blocColumnName, child);
					});

					// Total des heures
					var sommeHeures = 0;
					var sommeJours= 0;
					// Ajout dans une balise td pour la mise en page
					var child = {
						tag : 'tbody',
						cls : 'bloc-tableBody'
					};
					var blocTableBody = dh.append(blocTable, child);
					
						
		
					// UnitesFormations
		
					periode.getData().cursus.uniteFormationCursuses.forEach(function(uf) {
						var child = {
							tag : 'tr',
							cls : 'bloc-tableRowData'
						};
						var blocTableRowData = dh.append(blocTableBody, child);
						var child = {
							tag : 'td',
							cls : 'bloc-tableData'
						};
						var blocTableData = dh.append(blocTableRowData, child);

						var child = {
							tag : 'div',
							cls : 'bloc-global'
						};
						var blocGlobal = dh.append(blocTableData, child);

						// Ajout des deux blocs principaux
						var child = {
								tag : 'div',
								cls : 'entete-uf',
								html : uf.ufcNom
							};
							var enteteUf = dh.append(blocGlobal, child);
						
						
						var child = {
							tag : 'div',
							cls : 'bloc-reac',
						};
						var blocReac = dh.append(blocGlobal, child);

						var child = {
							tag : 'div',
							cls : 'bloc-uf'
						};
						var blocUniteFormation = dh.append(blocGlobal, child);


						// preparation de la liste des savoirs
						var savoirsArray = new Array();

						// Modules
						uf.moduleCursuses.forEach(function(module) {

							// bloc module
							var child = {
								tag : 'div',
								cls : 'bloc-module'
							};
							var blocModule = dh.append(blocUniteFormation, child);

							// blocs secondaires cours/infos

							// entete module
							var child = {
								tag : 'div',
								cls : 'entete-module',
								html : module.mocIntitule
							};
							var enteteModule = dh.append(blocModule, child);

							// nb jours module
							var child = {
								tag : 'div',
								cls : 'bloc-jour'
							};
							var blocInfoModuleJour = dh.append(blocModule, child);
							
							// nb heures module
							var child = {
								tag : 'div',
								cls : 'bloc-heure'
							};
							var blocInfoModuleHeure = dh.append(blocModule, child);

							
							
							// blocs vides pour rendu CSS
							var child = {
								tag : 'div',
								cls : 'bloc-vide'
							};
							var blocVide = dh.append(blocModule, child);

							var child = {
								tag : 'div',
								cls : 'bloc-cours'
							};
							var blocCours = dh.append(blocModule, child);

							var child = {
								tag : 'div',
								cls : 'bloc-infomodule',
							};
							var blocInfoModule = dh.append(blocModule, child);

							// contenu info module

							var child = {
								tag : 'div',
								cls : 'bloc-evaluation',
								html : module.mocModalite
							};
							var blocInfoModuleEvaluation = dh.append(blocInfoModule,
									child);

							var child = {
								tag : 'div',
								cls : 'bloc-commentaire',
								html : module.mocObjectifs
							};
							var blocInfoModuleCommentaire = dh.append(blocInfoModule,
									child);

							// Cours
							var moduleJours = 0;
							var moduleHeures = 0;
							module.coursCursuses.forEach(function(cours) {

								var child = {
									tag : 'div',
									cls : 'row-cours',
									html : cours.cocIntitule
								};
								var rowCours = dh.append(blocCours, child);

								var child = {
									tag : 'div',
									cls : 'infos-cours',
									html : cours.cocDuree
								};
								var infosCours = dh.append(blocCours, child);

								var child = {
										tag : 'div',
										cls : 'infos-coursHeure',
										html : cours.cocDuree*7
									};
								var infosCoursHeure = dh.append(blocCours, child);
								
								moduleJours = moduleJours + cours.cocDuree;
								moduleHeures = moduleJours*7;
								sommeJours = sommeJours + cours.cocDuree;
								sommeHeures = sommeJours*7;
								// ajout de tous les savoirs (pas de duplication) dans
								// la liste
								cours.savoirs.forEach(function(savoir) {
								
									Ext.Array.include(savoirsArray, savoir);
								});

							});

							dh.insertHtml('afterBegin', blocInfoModuleHeure,
									moduleHeures);

							dh.insertHtml('afterBegin', blocInfoModuleJour,
									moduleJours);
						});

						// ajout des savoirs dans le bloc correspondant
						Ext.Array.forEach(savoirsArray, function(savoir) {
							var child = {
								tag : 'div',
								cls : 'bloc-savoir',
								html : savoir.savLibelle
							};
							var blocSavoir = dh.append(blocReac, child);
						});

					});
				
					sommeJours = sommeJours.toString().concat(' j');
					sommeHeures = sommeHeures.toString().concat(' h');
					var child = {
						tag : 'div',
						cls : 'bloc-sommeHeure'
					};
					var blocSommeHeure = dh.append(htmlBody, child);
					var child = {
						tag : 'div',
						cls : 'bloc-sommeHeureTxt',
						html : 'Total des jours et heures de cours en centre :'
					};
					var blocSommeHeureTxt = dh.append(blocSommeHeure, child);
					
					var child = {
							tag : 'div',
							cls : 'bloc-sommeJoursNb',
							html : sommeJours
						};
					var blocSommeJourNb = dh.append(blocSommeHeure, child);
					var child = {
							tag : 'div',
							cls : 'bloc-sommeHeureNb',
							html : sommeHeures
						};
					var blocSommeJourNb = dh.append(blocSommeHeure, child);
					});
				};
				var win = window.open('printSchemaPedagogique.html');
				win.onload = drawDocument;
			}
			}
		});

		

		
	},

onPrintOrdoClick : function(bouton) {

		var vm = this.getViewModel();
		var uniteFormationStore = vm.getStore('rootCursuses');
		var cursus = uniteFormationStore.getRoot().getChildAt(0);
		var cursusData = cursus.pseudoWriting();
		var coursStore = vm.getStore('coursByCursus');
		var coursData = coursStore.getData().items;
		var periodeStore = vm.getStore('periodeStore');
		var periodeData = periodeStore.getData().items;
		
		//calcul de la taille des cellules du tableau période function/myFunctions.js
		var rowWidthList = getPeriodeRowWidth(coursData, periodeData);
		
		
		var drawDocument = function() {

			var htmlBody = this.document.body;

			var dh = Ext.DomHelper;

			// nom document
			var today = new Date();
			var day = today.getDate();
			var month = today.getMonth() + 1;
			if (month < 10) {
				month = '0' + month;
			}
			var year = today.getFullYear();
			var dateToday = day + '/' + month + '/' + year;
			var documentName = 'Ruban Pédagogique : ' + cursusData.curNom
					+ ' | ' + dateToday;
			this.document.title = documentName;

			
			var schemaPedago = 'Ruban pédagogique : ';
			var child = {
				tag : 'div',
				cls : 'bloc-title',
				html : schemaPedago.concat(cursusData.curNom),
			};
			var blocTableH = dh.append(htmlBody, child);
			
			
			var child = {
					tag : 'div',
					cls : 'div-table1'
				};
			var divTable = dh.append(htmlBody, child);
			
			
			var child = {
				tag : 'table',
				cls : 'bloc-table1'
			};
			var blocTable = dh.append(divTable, child);
			
				
			
			var child = {
				tag : 'thead',
				cls : 'bloc-tableHead'
			};
			var blocTableHead = dh.append(blocTable, child);
			var child = {
					tag : 'tr',
					cls : 'periode-tableRowHead'
				};
				var blocTableRowHead = dh.append(blocTableHead, child);
				
			
				var child = {
					tag : 'th',
					cls : 'column-anneeRp',
					html : 'Année'
				};
				var column = dh.append(blocTableRowHead, child);
	

			// Ajout dans une balise td pour la mise en page
			var child = {
				tag : 'tbody',
				cls : 'bloc-tableBody'
			};
			var blocTableBody = dh.append(blocTable, child);


			periodeData.forEach(function(periode, index) {
				
				var child = {
					tag : 'tr',
					cls : 'periode-tableRowData'
				};
				var blocTableRowData = dh.append(blocTableBody, child);
			
				var child = {
							tag : 'td',
							cls : 'td-periode',
							html : periode.getData().perNom,
							height : rowWidthList[index]
						};
				var blocTableData = dh.append(blocTableRowData, child);

			});
			
			var child = {
					tag : 'div',
					cls : 'div-table2'
				};
			var divTable = dh.append(htmlBody, child);
			
			
			var child = {
				tag : 'table',
				cls : 'bloc-table2'
			};
			var blocTable = dh.append(divTable, child);
			var child = {
				tag : 'thead',
				cls : 'bloc-tableHead'
			};
			var blocTableHead = dh.append(blocTable, child);
			
			var child = {
					tag : 'tr',
					cls : 'cours-tableRowHead'
				};
				var blocTableRowHead = dh.append(blocTableHead, child);
				
			
			var columnName = [
					[ 'ECF', 'column-ecfRp' ], [ 'Cours', 'column-coursRp' ],
					[ 'Jour', 'column-jourRp' ] ];

			columnName.forEach(function(element, index, array) {
				var child = {
					tag : 'th',
					cls : element[1],
					html : element[0]
				};
				var column = dh.append(blocTableRowHead, child);
			});

			// Total des jours
			var sommeJour = 0;

			// Ajout dans une balise td pour la mise en page
			var child = {
				tag : 'tbody',
				cls : 'bloc-tableBody'
			};
			var blocTableBody = dh.append(blocTable, child);


			coursData.forEach(function(cours, index) {
				sommeJour = sommeJour + cours.getData().cocDuree;
				
				
				var child = {
					tag : 'tr',
					cls : 'cours-tableRowData'
				};
				var blocTableRowData = dh.append(blocTableBody, child);
				
				
				var child = {
						tag : 'td',
						cls : 'td-ecf',
						//html :
					};
				var blocTableData = dh.append(blocTableRowData, child);
				var child = {
						tag : 'td',
						cls : 'td-cours',
						html : cours.getData().cocIntitule
					};
				var blocTableData = dh.append(blocTableRowData, child);
				var child = {
						tag : 'td',
						cls : 'td-duree',
						html : cours.getData().cocDuree
					};
				var blocTableData = dh.append(blocTableRowData, child);

				

			});

			// Total des heures
			// var sommeHeure =0;
			// Total des heures de cours
			var child = {
				tag : 'div',
				cls : 'bloc-sommeJourRp'
			};
			var blocSommeJour = dh.append(htmlBody, child);
			
			var child = {
				tag : 'div',
				cls : 'bloc-sommeJourRpTxt',
				html : 'Total des jours de cours en centre :'
			};
			var blocSommeJourTxt = dh.append(blocSommeJour, child);
			var child = {
				tag : 'div',
				cls : 'bloc-sommeJourRpNb',
				html : sommeJour
			};
			var blocSommeJourNb = dh.append(blocSommeJour, child);
		};

		var win = window.open('printRubanPedagogique.html');
		win.onload = drawDocument;
}

	
});
