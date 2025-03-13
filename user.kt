class User(val publicInf: UserInfPublic, val privateInf: UserInfPrivate, val currency: Int) {

}
enum class TypeAccount{
PERSONAL, PROFESSIONAL
}
//Add authentication method later
class UserInfPrivate(val gender: Bool, val date: Int, val email: String,){

}

//Change horary type to time
class UserInfPublic(val name: Int, val location: String, val typeAccount:TypeAccount, val description: String, val horary: Int, val phone: Int, val web: String, val storeAddress: String){

}

class UserPurchases(){

}
class UserSales(){
    
}