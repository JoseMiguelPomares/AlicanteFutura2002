class User(val name: String, val publicInf: UserInfPublic?, val privateInf: UserInfPrivate?, val currency: Int?) {

}
enum class TypeAccount{
PERSONAL, PROFESSIONAL
}
//Add authentication method later
class UserInfPrivate(val gender: Bool?, val date: Int?, val email: String?,){

}

//Change horary type to time
class UserInfPublic(val name: String, val location: String?, val typeAccount:TypeAccount?){

}

class UserPurchases(){

}
class UserSales(){
    
}

class Product(val name: String, val owner: User){

}
class Transaction(val product: Product, val requesting: User, val offering: User){

}

fun exchange(trans: Transaction){
    Product p = trans.product
    p.owner = requesting
}

fun main(args: Array<String>) {
    val user1 = User("Alice",null,null,null)
    val user2 = User("Mateo",null,null,null)

    val productP1 = Prodbuct("Box",user2)
    val ex = Transaction(productP1, user1, user2)
    exchange(ex) 

    val products = mutableListOf()

} 
//Product List 

//Product Search

//Product Deletion 

//Product Creation 

//Product Transaction