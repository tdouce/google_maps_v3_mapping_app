
$(document).ready(function(){

    // Delete skype css that sometimes adds unwanted and unfinished markup (ie. skype text) in the
    // table data (contact information about a site)
    window.setTimeout(function() {
			$('.skype_pnh_container').html('');
			$('.skype_pnh_print_container').removeClass('skype_pnh_print_container');
    }, 800);
    

    // location of xml file
    var xml_url_location =  "http://gce-lter.marsci.uga.edu/public/file_pickup/Travis/lter_maps.xml";

    // first select option in drop down
    var first_select_option = '- - - - - - - - - - Zoom to LTER site - - - - - - - - -';

    // Get xml file if status 200 and invoke function to build map and select options
    $.ajax({
        type: "GET",
        url: xml_url_location,
        dataType: "xml",
        success: xmlParser_map_select_click
    });


    // Add text as first option in select options 
    $('#build_select').append(
        $('<option></option>').html( first_select_option )         
    );

    // Function that sets the appropriate zoom and extent so that all markers fit
    // in the map
    function fit_markers_to_map(){ 
        map.fitBounds(bounds);
    };

    // Function that decides whether or not to show the data table row (the one with 'tabs')
    function should_show_data_table(){
        if( $('#build_select').val() ==  first_select_option )
            {
                $('#site_info').hide();
            } 
        else
            {
                $('#site_info').show();
            };
    };

    // Function that decides whether or not to show the data table row (the one with 'tabs')
    should_show_data_table();

    // Function used to generate html content
    function render_page_content( object ){

        // Function that decides whether or not to show the data table row (the one with 'tabs')
        should_show_data_table();

        // Hide all tabs so only one is shown at a time, or else the previous tab selection will be
        // showing
        $('#photos, #contacts, #photos, #site_links, #site_information, #lter_name').hide();

        $('#photos, #contacts, #photos, #site_links, #site_information, #lter_name').addClass( 'focus_table_background' );

        // Set all tab backgrounds to nothing
        $('.hover').removeClass('focus_hilight');

        // Show only the 'site_information' tab
        $("#site_information, #lter_name").show();
        
        $('#table_content').addClass('table_content_border');

        // Set 'site info' tab to the same color as the highlight. Have to use inline css styling
        // rather than adding a class because it will not work properly in IE
        $('#site_info_tab').addClass('focus_hilight');

        // Inserting xml data into the html (The rest of the code in this function)
        ////////////////////////////////////

        // Insert site name into html 
        $('#site_info').find('.site_name').html( object.attr('site_name') ); 

        // Site Info Tab. Insert href location and target into html
        $('#site_content' ).find('.home_page').attr(  { href: object.attr('home_page'), target: "_blank" } ); 
        $('#site_content' ).find('.site_profile').attr(  { href: 'http://www.lternet.edu/sites/' + object.attr('site_id').toLowerCase() , target: "_blank" } ); 
        $('#site_content').find('.description').html( object.attr('description') ); 

        // Photos tab. Insert image and href into html
        $('#site_content' ).find('.image').attr(  { src: object.attr('image') , title: object.attr('site_id') + 'image' } ); 
        $('#site_content' ).find('.gallery').attr(  { href: 'http://www.lternet.edu/gallery/sites/' + object.attr('site_id') , target: "_blank"} ); 

        // Contacts Tab. Insert into html
        $('#site_content' ).find('.principal').html( object.attr('principal') ); 
        $('#site_content' ).find('.info_manager').html( object.attr('info_manager') ); 
        $('#site_content' ).find('.primary_contact').html( object.attr('primary_contact') ); 
        $('#site_content' ).find('.outreach').html( object.attr('education_contact') ); 
        $('#site_content' ).find('.address1').html( object.attr('address1') ); 
        $('#site_content' ).find('.address2').html( object.attr('address2') ); 
        $('#site_content' ).find('.address3').html( object.attr('address3') ); 
        $('#site_content' ).find('.city').html( object.attr('city') ); 
        $('#site_content' ).find('.state').html( object.attr('state') ); 
        $('#site_content' ).find('.zip').html( object.attr('zip') ); 
        $('#site_content' ).find('.phone').html( object.attr('phone') ); 
        $('#site_content' ).find('.fax').html( object.attr('fax') ); 
        $('#site_content' ).find('.email').html( object.attr('email') ); 

        // Site Links tab. Insert href and target info into html
        $('#site_content' ).find('.data_url').attr(  { href: object.attr('data_url') , target: "_blank"} ); 
        $('#site_content' ).find('.personnel_url').attr(  { href: object.attr('personnel_url') , target: "_blank"} ); 
        $('#site_content' ).find('.biblio_url').attr(  { href: object.attr('biblio_url') , target: "_blank"} ); 
        $('#site_content' ).find('.education_url').attr(  { href: object.attr('education_url') , target: "_blank"} ); 
    };

    // Function used to to build listener for when google map marker is clicked and to add site to
    // select options (this dynamically builds the select options based on when is in the xml). 
    // When the marker is clicked then generate the associated html page content, 
    // open the infowindow for the marker and populate it with correct name
    function set_marker_selectoptions_content(marker, site_name, object, latitude, longitude ) {

        // Push marker object to associate array so we can call it later. This will be used to
        // correlate the rendering of the html content when a value is selected in the select options
        markers[ site_name ] = [ marker, site_name, latitude, longitude ]
     
        // Add listener to marker. When clicked, render html content for the marker and set select
        // option value to the marker that was clicked
        google.maps.event.addListener(marker, 'click', function() {

            // Set value of the select options to that of the marker that was clicked
            $('#build_select').val(  site_name  );

            // Render the associated html content for the marker
            render_page_content( object );

            should_show_data_table();

            // Pan to associated marker and set zoom
            map.panTo( new google.maps.LatLng( markers[ $('#build_select').val() ][2], markers[ $('#build_select').val() ][3] ));
            map.setZoom(7);

            // Grab the object from the associative array that we created earlier and set the
            // infowindow value and open up the infowindow
            infowindow.setContent( markers[ $('#build_select').val() ][1] );
            infowindow.open( map, markers[ $('#build_select').val() ][0] );

        });

        // Add site name to option select
        $('#build_select').append(
            $('<option></option>').html( object.attr('site_name') )         
        );

    };

    // Array used to hold marker objects so we can retrieve them
    var markers = [];

    var map; 

    var myOptions = {
        zoom: 1,
        center: new google.maps.LatLng( 0, 0 ),
        navigationControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map =  new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    // Instantiate variable for info window and marker
    var infowindow = new google.maps.InfoWindow();
    var marker;
    var bounds = new google.maps.LatLngBounds();


    // Function invoked in the ajax call
    function xmlParser_map_select_click(xml) {
       
        $(xml).find("marker").each(function() {

            marker = new google.maps.Marker({
                position: new google.maps.LatLng( $(this).attr('latitude'), $(this).attr('longitude') ),
                map: map
            });

            bounds.extend( new google.maps.LatLng( $(this).attr('latitude'), $(this).attr('longitude') ) );        

            // Assign site_name from xml and site_id
            var site_name =  $(this).attr('site_name');      
            var site_id = $(this).attr('site_id');
            
            // Invoke function to generate the page html content
            set_marker_selectoptions_content(marker, site_name, $(this), $(this).attr('latitude'), $(this).attr('longitude') );

        });

        //Show or hide all maps immediately when select options value changes (ie. when checked or not checked)
        $("#build_select").change(function(){

            // Render the html page content for the select option that was selected
            $(xml).find("marker").each(function() {
                    
                if ( $(this).attr('site_name') ==  markers[ $('#build_select').val() ][1]  )
                    {
                        render_page_content( $(this) );

                        // Pan to associated marker and set zoom
                        map.panTo( new google.maps.LatLng($(this).attr('latitude'), $(this).attr('longitude'))  );
                        map.setZoom( 7 );

                        // Grab the object from the associative array that we created earlier and set the
                        // infowindow value and open up the infowindow
                        infowindow.setContent( markers[ $('#build_select').val() ][1] );
                        infowindow.open( map, markers[ $('#build_select').val() ][0] );

                    };
            });
        });

        // Fit all markers on map and set appropriate zoom when map initially loads
        fit_markers_to_map();     

        // When 'zoom to full extent' is clicked map is zoomed to appropriate extent and zoom 
        $('#to_full_extent').click(function() {
            fit_markers_to_map();
        });


        // Adds listener for zoom_changed event.  If zoom level is '0' set zoom level to '1'.
        // This keeps the user from zooming out to far so that the continents and markers are duplicated
        google.maps.event.addListener(map, 'zoom_changed', function() {

            if ( map.getZoom() == 0 ) 
            {
                map.setZoom( 1 );
            };
        
        });
    
    };


    // Function that 1) Adds and removes kmz layers on google in association with checkboxes, 2)
    // Downloads files and directs to links when buttons are clicked, 3) Removes all layers when
    // 'Remove All Layers' text is clicked
    function add_remove_google_layers(){ 

        // Associate array that will hold all the google maps kmllayer objects.  We will call them up
        // using this later
        kml_layers = [];

        // Looop through each input with class '.clickable', get the data-url attribute and build a
        // google maps kmllayer object
        $('.layer').each(function() {
            kml_layers[ $(this).attr('id') ] = new google.maps.KmlLayer( 'http://www.lternet.edu/sites1/' + $(this).attr('data-kmz') );
        });
        

        // When checkbox is clicked add or remove the associated kml
        $('.layer').click(function(){

            if ( $('#' + $(this).attr('id') ).attr('checked') ){
                
                // Grab the google kml object from the associate array and set it map
                kml_layers[ $(this).attr('id') ].setMap(map);

            }
            else {

                // Grab the google kml object from the associate array and remove it from map
                kml_layers[ $(this).attr('id') ].setMap(null);
            }

            //fit_markers_to_map();
        });


        // When the reset id is clicked then remove all the layers from the map and zoom to full extent
        $('#reset').click(function(){

           $('.layer').each(function() {
                kml_layers[ $(this).attr('id') ].setMap(null);
                $(this).removeAttr('checked');
            });

            //fit_markers_to_map();
        });


        // download shapefile in current window when .shp button is clicked
        $('.download_shp').click(function(){
            window.location.href = 'http://www.lternet.edu/map/' +  $( '#' + $(this).attr('name') ).attr('data-shp');
        });

        // download .kmz in current window when .shp button is clicked
        $('.download_kmz').click(function(){
            window.location.href = 'http://www.lternet.edu/map/' +  $( '#' + $(this).attr('name') ).attr('data-kmz');
        });

        //Go to a new window and view html when 'meta' button is clicked
        $('.download_meta').click(function(){
            window.open( 'http://www.lternet.edu/map/' +  $( '#' + $(this).attr('name') ).attr('data-meta') );
        });

    };


    // Controlls user interface for the table data that pops up to the right of the google map
    // and displays information about a specific site. Specifically it controls the tab
    // functionality and hiding and showing of table rows when the associated tab is clicked
    function table_data_functionality(){

        //Hides all tabs initially 
        $('#photos, #contacts, #photos, #site_links, #site_information, #lter_name').hide();

        // Change table row to highlighted color when user hovers over. However, if the the user hovers
        // over the tab that is currently being shown then do not remove the hilight (other wise the
        // tab currently being viewed will not be hilighted)
        $("td.hover").hover(
          function () {

            if (  $('#' + $(this).attr('data-source')).is(":hidden") )
                { 
                    $(this).addClass('focus_hilight');
                }
          }, 
          function () {

            if (  $('#' + $(this).attr('data-source')).is(":hidden") )
                { 
                    $(this).removeClass('focus_hilight');
                }
          }
        );


        // When the tab is clicked, hilight it and show the associated data content (table row)
        $('.hover').click(function() {

            // Removes background for 'Site Info' tab
            $('*').removeClass('focus_hilight');

            // Hides all table rows
            $('#photos, #contacts, #photos, #site_links, #site_information').hide();

            // Only show table row for the tab that is selected
            $( '#' + $(this).attr('data-source') ).show();

            // Sets background color for tab that is selected
            $(this).addClass('focus_hilight');
            
        });

        // Makes any href link inside the <tr> respond to the href click rather (so they can visit the
        // associated link) than another click event. 
        $('tr a').click(function(e){
            e.stopPropagation(); 
        })

        // On hover change color and font-weight of 'zoom_to_full_extent' text 
        $(".map_controller").hover(
          function () {
            $(this).addClass( 'zoom_text_color');
          }, 
          function () {
            $(this).removeClass( 'zoom_text_color');
          }
        );

    };

    // Invokes functions
    add_remove_google_layers();
    table_data_functionality();

});

