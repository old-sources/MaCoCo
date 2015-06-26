Ext.define('ExtJsMVC.view.referentiel.arbre.ArbreReferentielViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ArbreReferentielViewController',
    init: function()
	{
		
    	
		this.control
		({
			'arbre-Referentiel' : 
			{
				selectionchange : this.chargeRefTreeForm,
				itemclick : this.chargeSavForm,
				itemcontextmenu : this.onRefTreeContextMenu,
			},
			
		});
		
	},
	chargeRefTreeForm : function(grid, selectedRecords)
	{
		var record = selectedRecords[0];
		var vm = this.getViewModel();
		var switchview = Ext.ComponentQuery.query('#switchView')[0];
		var myStore;
		//var itemSelectedId;
		var myUrl;
		
		var modelName = record.entityName;
		switch(modelName) 
		{	
		case 'ExtJsMVC.model.referentiel.Referentiel' :
			
		       console.log('Affichage Referentiel');
		       
		       //Nettoyage de la vue centrale
		       if(switchview.getChildEls())
	    	   {
		    	   switchview.removeAll();
	    	   }
		       //Ajout de la vue correspondante
		       switchview.add({xtype : 'referentiel-DetailReferentiel'});
		       if(selectedRecords[0].get('refId')!== undefined){
			       myStore = vm.getStore('actTypeStore');
			       myUrl = '/imieWEB/webapi/activitetype/referentiel/'.concat(record.get('refId'));	
			       myStore.load({
			    	   url : myUrl,
			       });
		       }else {
		    	   vm.getStore('actTypeStore').removeAll();
			    }
			break;
			
		case 'ExtJsMVC.model.referentiel.ActiviteType' :
			
		       console.log('Affichage Activite Type');
		       
		       //Nettoyage de la vue centrale
		       if(switchview.getChildEls())
	    	   {
		    	   switchview.removeAll();
	    	   }
		       //Ajout de la vue correspondante
		       switchview.add({xtype : 'referentiel-DetailActiviteType'});
		       
		       if(selectedRecords[0].get('actId')!== undefined){
			       myStore = vm.getStore('compProStore');
			       myUrl = '/imieWEB/webapi/competencepro/activitetype/'.concat(record.get('actId'));	
			       myStore.load({
			    	   url : myUrl,
			       });		       			
		       }else {
		    	   vm.getStore('compProStore').removeAll();
			    }
			break;
			
		case 'ExtJsMVC.model.referentiel.CompetencePro' :
			
		       console.log('Affichage Competence Pro');
		       
		       //Nettoyage de la vue centrale
		       if(switchview.getChildEls())
	    	   {
		    	   switchview.removeAll();
	    	   }
		       //Ajout de la vue correspondante
		       switchview.add({xtype : 'referentiel-DetailCompetencePro'});

		       if(selectedRecords[0].get('comId')!== undefined){
			       myStore = vm.getStore('savoirStore');
			       myUrl = '/imieWEB/webapi/savoir/competencepro/'.concat(record.get('comId'));	
			       myStore.load({
			    	   url : myUrl,
			       });
		       }else {
		    	   vm.getStore('savoirStore').removeAll();
			    }
			break;
			
		case 'ExtJsMVC.model.referentiel.Savoir' :
			
		       console.log('Affichage Savoir');
		    
		       if(selectedRecords[0].get('savId')=== undefined){
			       //Nettoyage de la vue centrale
			       if(switchview.getChildEls())
		    	   {
			    	   switchview.removeAll();
		    	   }
			       //Ajout de la vue correspondante
			       switchview.add({xtype : 'referentiel-DetailSavoir'});
		       }	
			break;
	
			
			        
			
			
			default:
				console.log('Ne correspond pas');
		} 
	},
	
	
	chargeSavForm : function(grid, selectedRecord)
	{
		
		var switchview = Ext.ComponentQuery.query('#switchView')[0];
	
		
		var modelName = selectedRecord.entityName;
		if(modelName ==='ExtJsMVC.model.referentiel.Savoir') 
		{	

		   console.log('Affichage Savoir');
		    
		   if(selectedRecord.get('savId')!== undefined){
			   //Nettoyage de la vue centrale
		   if(switchview.getChildEls())
		   {
			   switchview.removeAll();
		    }
			  //Ajout de la vue correspondante
			switchview.add({xtype : 'referentiel-DetailSavoir'});
		 }	

		} 
	},
	
	onRefTreeContextMenu : function(tree,record,item,index,e,eOpts){
    	e.stopEvent();
    	
    	var vm = this.getViewModel();
    	var myStore;
    	var me = this;
    	var modelName = record.entityName;
    	var menu;


		switch(modelName) 
		{	
			case 'ExtJsMVC.model.referentiel.Savoir' :
		    	menu = new Ext.menu.Menu({	
		    		items:[ 
		    		{
		    			text : 'supprimer le savoir',
		    			handler:function(){
		    				myStore = vm.getStore('savoirStore');
		     				myUrl = '/imieWEB/webapi/savoir/'.concat(record.get('savId'));	
							myStore.load({
								url : myUrl,
								callback : function(){
				    				myStore.removeAll();
				    				myStore.sync();
								}
							});
		    	    	},
		    		}
		    		]
		    	}).showAt(e.getXY());
			break;
			
			case 'ExtJsMVC.model.referentiel.CompetencePro' :
				menu = new Ext.menu.Menu({	
		    		items:[ 
		    		{
		    			text : 'supprimer la compétence pro',
		    			handler:function(){
		    				myStore = vm.getStore('compProStore');
		    				myUrl = '/imieWEB/webapi/competencepro/'.concat(record.get('comId'));	
							myStore.load({
								url : myUrl,
								callback : function(){
				    				myStore.removeAll();
				    				myStore.sync();
								}
							});
		    	    	},
		    	    	border : '0 0 1 0',
		    	    	style : {
		    	    		borderColor : '#CCCCCC',
		    	    		borderStyle: 'solid'
		    	    	}
		    		},{
		    			text : 'ajouter un savoir',
		    			handler:function(){
		    				me.onAddButtonClick();		    	    	
		    			},	
		    		},
		    		]
		    	}).showAt(e.getXY());
			break;
		
			case 'ExtJsMVC.model.referentiel.ActiviteType' :
				menu = new Ext.menu.Menu({	
		    		items:[ 
		    		{
		    			text : 'supprimer l\'activité type',
		    			handler:function(){
		    				myStore = vm.getStore('actTypeStore');
		    				myUrl = '/imieWEB/webapi/activitetype/'.concat(record.get('actId'));	
							myStore.load({
								url : myUrl,
								callback : function(){
				    				myStore.removeAll();
				    				myStore.sync();
								}
							});
		    				
		    	    	},
		    	    	border : '0 0 1 0',
		    	    	style : {
		    	    		borderColor : '#CCCCCC',
		    	    		borderStyle: 'solid'
		    	    	}
		    		},{
		    			text : 'ajouter une compétence pro',
		    			handler:function(){
		    				me.onAddButtonClick();
		    	    	},	
		    		},
		    		]
		    	}).showAt(e.getXY());
			break;
			
			case 'ExtJsMVC.model.referentiel.Referentiel' :
				menu = new Ext.menu.Menu({	
		    		items:[ 
		    		{
		    			text : 'ajouter une activité type',
		    			handler:function(){
		    				me.onAddButtonClick();
		    	    	},	
		    		},
		    		]
		    	}).showAt(e.getXY());
			break;
			
			default:
				console.log('Ne correspond pas');
		} 	
    },

});