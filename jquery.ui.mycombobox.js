(function($) {

    $.widget("ui.mycombobox", {
        
        // options which we are using in the plugin
        options: {
            list: []
        },
	
        // Called when the plugin is created
        _create: function() {
            var self = this;
            
            try{
                self._calculate();
            }
            catch(e){
                //console.log(e.toString());
                return;
            }
            
            self._callCreate();
            
        },
        
        _callCreate : function(){
            
            var self = this;
            
            // hidden fields
            var input_hide = $( "<input>" )
            .attr('id', self.hide_id )
            .val( "" )
            .hide()
            .insertAfter( self.el );
            
            // applying the autocomplete to the elements
            self.el.autocomplete({
                source: self.array,
                select: function( event, ui ) {  
                    $( "#" + self.hide_id ).val( self.rlist [ui.item.value] );  
                },
                search: function( event, ui ) {
                    $( "#" + self.hide_id ).val('');
                }
            });
            
        },
        
        /**
         * Update method called to update the blugin
         */
        _update : function(){
            var self = this;
            
            try{
                self._calculate();
            }
            catch(e){
                //console.log(e.toString());
                return;
            }
            
            // if the input field is not made
            if($( "#" + self.hide_id ).length == 0){
                self._callCreate();
            }
            else{
                self.el.autocomplete("option", {
                    // array to reset
                    source: self.array,
                    // method to reset according to the array
                    select: function( event, ui ) {  
                        $( "#" + self.hide_id ).val( self.rlist [ui.item.value] );  
                    },
                    search: function( event, ui ) {
                        $( "#" + self.hide_id ).val('');
                    }
                });
            }
        },
        
        // calculation for all the plugins
        _calculate : function(){
          
            var self = this, // pointing to the current element
            o = self.options, // getting the current option
            el = self.element, // getting the current jquery element
            list = {},
            rlist = [],
            array = [];
            // checking the list is not empty
            if($.isEmptyObject(o.list) === true){
                throw new Error("Mycombobox Plugin : List is not defined ");
            }
            else{
                // get the obj list 
                if(typeof o.list == "string")
                    list = $.parseJSON(o.list);
                else
                    list = o.list;
            }
            
            // converting obj to array
            for( var x in list){
                array.push(list[x])
                // exchanging the array value with keys
                rlist[list[x]] = x;
            }
            
            // current elements id value
            var ids = el.attr('id');
            
            this.hide_id = ids + "_show_val";
            this.array = array;
            this.rlist = rlist;
            this.list = list;
            this.el = el;
        },
        
        // $(“element_caption_attached_to”).mycombobox(“destroy”);
        // to distroy the elemets and remove all the code
        destroy: function() {	
            // distroying the autocomplete 
            this.element.autocomplete("destroy");
            // removing the created element
            $("#"+this.element.attr('id') + "_show_val").remove();
            // call the base destroy function
            $.Widget.prototype.destroy.call( this );
        },
        
        // this is public method to get the value of element 
        getVal : function getVal(){
            var el = this.element
            var self = this;
            var ret = "";
                       
            if(typeof self.hide_id == "undefined" && typeof self.el == "undefined"){
                ret = el.val();
            }
            else{
                
                if($( "#" + self.hide_id ).val() != "")  
                    ret =  $( "#" + self.hide_id ).val();
                else
                    ret = self.el.val();
            }
            return ret;
        },
        
        // calling options for update and select value
        _setOption: function(key, value) {
            var el = this.element
            var self = this;
            
            switch(key){
                
                case "value":
                    
                    var val = value;
                    if(typeof value == "object"){
                        val = value.val;
                        self.list = value.list;
                        self._create();
                    }
                    
                    $( "#" + self.hide_id ).val( val  );  
                    self.el.val(self.list[val]);
                    
                    break;
                
                case "clean":
                    el.val('');
                    if(typeof self.hide_id != "undefined" && $( "#" + self.hide_id ).length > 0)
                        $( "#" + self.hide_id ).val( '' );
                    break;
                
                default:
                    this.options[ key ] = value;
                    this._update();   
                    break;
            }
                     
        }
    });
})(jQuery);