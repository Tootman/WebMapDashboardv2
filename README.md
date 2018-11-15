## MapAdmin
Provides a dashboard with MapView, for managing online Maps, intended for surveyor Staff / managers
version: 0.9 - not yet ready - not releaased

# Features
 - Import a zipped set of shapefiles as a map
 - filterable and sortable tabular view of features with their RelatedData
 - highlight filtered set of features on a map
  -  Inspect explor Map data in a tree view of nodes
  -  Export mapdata CSV or as ShapeFile set
  -  Upload Dataset to the cloud database, as a new map 
  -  User Not logged in can access one set of webpages (Read only), user logged in can access additionally MapAdmin page (read and write to database)

# Bugs / fixes to do
 - large dataset can freeze UI while busy - how to interrupt
 - how to report 'busy' status to user while canvas is busy when redrawing large datasets on Leaflet map 
 - Visual style and layout  - replace MapAdmin tabs with menu
 - Add company branding /logo /visual style 
 - Create webpage content for public static Webpages
 - Addess 'bundle much too large' message

# Notes
 - Demo : <>
 - MapAdmin component structure: <goo.gl/LsMg5o>
 - Contect API to access User permissions on page components
- Leaflet object shared thorughout Application


## Functional specification
#### onMapLoad
    Retrieve Map data from Firebase Database into MapAdmin State
    forEach record in RelatedData
        Inject most recent RelatedData into MapData feature matching ObjectID
    forEachFeature
        if hasProperty 'highlightOnMap' and is True then use HighlightedStyle
        else use unhighlightedstyle

#### onSelectAll_clicked
    for EachRow in FilteredSetOfRows
      // Row Index corresponds directly to index of feature in Map GeoJson Data 
      set highlightOnMap property of MapDataFeature element RowIndex to TRUE

#### onSelectNone_clicked
    forEachFeature in map
        set highlightOnMap property to FALSE

## How it it built - technology stack
 - Leaflet Mapping API
 - ReactJS v 16.3 (with Webpack via Create-react-App)
 - Firebase database for Cloud storage
 - Bootstrap 4  

## Proposed Client WebMap View
# User requirement 
- Ability to easily search for feature (or set of features), and  highlight on map,  by Condition, featureName, or Memorial Plaque / memorial name
 - Apply bookmarks (extents or map bounds), if map based on ward and/or park name(s)
 - Ability to see who (person or organisation) owns/manages an asset
  - Useful, but not essential, to have the ability to load data for the whole borough into MapAdmin, all at once
### User Stories
 - As a GIS user / client end-user I want to be able to respond to a customer  enquiry asking me where abouts in a park they can find their memorial bench (or memorial tree), by intuatively searching/inspecting an interactive WebMap

 - As a GIS user / client end-user I want to easily find the information on who owns (or manages) a specific feature that I have identified on the WebMap (eg a specific boundary wall.

 - (As a 'friend of park' (or as member of the public?) I want to identify the location of my memorial bench (or memorial tree), from a WebMap
 