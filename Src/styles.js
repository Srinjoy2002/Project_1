import { StyleSheet } from "react-native";

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  Colors:{
   primary : '#D83F3F',
   textColor:'#515151',
   linkColor:'#006EFF',
   blackColor:'#000000',
   secondColor:'#757575',
   successBackgroundColor:'#DAFFEE',
   successTextColor:'#006939'
  },
  verticalseparator: {
    width: 1, 
    borderWidth: 1, // Use full border width instead of borderLeftWidth
    borderStyle: 'dashed', // Dashed line
    borderColor: '#6C6C70', // Color of the line
    height: 40, 
    marginHorizontal: 11,
  },
  separator: {
    borderStyle: 'dashed',
    borderWidth: 1,  // Applies dashed style to all borders
    borderColor: '#EBEBEB',
    marginVertical: 10,
    marginLeft: 40,
    marginTop: -20,
  },
  staraightSeparator: {
    height: 1,
    backgroundColor: '#F0EFF2',
    marginVertical: 10,
    marginLeft:5
  },
  locationText: {
    fontSize: 16,
    color: '#000000',
    marginLeft:10
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingVertical: 5, // Adds spacing
  },
  
  iconContainer: {
    marginRight: 10, // Adds spacing between icon and text
  },
  
  infoText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
  },
  
  infoText1: {
    fontSize: 15,
    color: '#555',
    marginLeft: 10, // Proper spacing instead of -30
  },
  
  infoText2: {
    fontSize: 15,
    color: '#555',
    marginLeft: 10, // Proper spacing instead of -30
  },
  
  });

export default commonStyles;
