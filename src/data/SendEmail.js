export default function sendEmail(msg, email){
  setTimeout(function () {
    console.log("Message \n\nEmail: "+email+"\n\n" +msg);
  }, 2000);
}