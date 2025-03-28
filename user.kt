import java.time.LocalDateTime

enum class CategoryType{
    CAR, SERVICE, SPORT, MULTIMEDIA, 
}
class Category(val id: Int, val name: CategoryType)
// Product class represents a product for sale
class Product(
    val id: Int,
    val name: String,
    var price: Double,
    var available: Boolean = true,
    val category: String, //Added category
)

enum class TransactionStatus{
    CANCELLED, PENDING, REFUNDED, SHIPPED, DELIVERED, SUCCESS
}

// Class to record transactions
data class Transaction(
    val id: Int,
    val product: Product,
    val buyer: String,
    val seller: String,
    val price: Double,
    val status: String, //TransactionStatus
    val notes: String? = null,
    val date: LocalDateTime = LocalDateTime.now() // Automatically captures the current date and time
)

// User class with authentication details
class User(
    val id: Int,
    val username: String,
    private val passwordHash: Int, // Store password hash for security
    val email: String,
    var balance: Double
) {
    private val productsForSale = mutableListOf<Product>()
    private val transactionsAsSeller = mutableListOf<Transaction>()
    private val transactionsAsBuyer = mutableListOf<Transaction>()
    private val ratings = mutableListOf<Int>() // List to store ratings from other users

    // Method to list a product for sale
    fun listProduct(product: Product) {
        productsForSale.add(product)
        println("$username listed the product: ${product.name} (Category: ${product.category}) for ${product.price}$")
    }

    // Method to buy a product from another user
    fun buyProduct(product: Product, seller: User, notes: String? = null): Boolean {
        if (product in seller.productsForSale && product.available) {
            if (balance >= product.price) {
                seller.productsForSale.remove(product)
                product.available = false
                balance -= product.price
                seller.balance += product.price

                // Record the transaction with the current date and time
                val transaction = Transaction(
                    product,
                    buyer = username,
                    seller = seller.username,
                    price = product.price,
                    status = "Completed",
                    notes = notes
                )
                transactionsAsBuyer.add(transaction)
                seller.transactionsAsSeller.add(transaction)

                println("$username bought ${product.name} from ${seller.username} for ${product.price}$ on ${transaction.date}")
                return true
            } else {
                println("$username doesn't have enough balance to buy ${product.name}")
            }
        } else {
            println("${product.name} is not available for sale")
        }
        return false
    }

    // Method to show all products the user has for sale
    fun showProductsForSale() {
        if (productsForSale.isEmpty()) {
            println("$username has no products listed for sale.")
        } else {
            println("$username's products for sale:")
            productsForSale.forEach { product ->
                val availability = if (product.available) "Available" else "Sold"
                println("- ${product.name} (Category: ${product.category}) for ${product.price}$ ($availability)")
            }
        }
    }

    // Method to show all transactions as a seller
    fun showTransactionsAsSeller() {
        if (transactionsAsSeller.isEmpty()) {
            println("$username has no sales transactions.")
        } else {
            println("$username's sales transactions:")
            transactionsAsSeller.forEach { transaction ->
                println(
                    "- Sold ${transaction.product.name} (Category: ${transaction.product.category}) to ${transaction.buyer} for ${transaction.price}$ on ${transaction.date} (Status: ${transaction.status}) Notes: ${transaction.notes ?: "None"}"
                )
            }
        }
    }

    // Method to show all transactions as a buyer
    fun showTransactionsAsBuyer() {
        if (transactionsAsBuyer.isEmpty()) {
            println("$username has no purchase transactions.")
        } else {
            println("$username's purchase transactions:")
            transactionsAsBuyer.forEach { transaction ->
                println(
                    "- Bought ${transaction.product.name} (Category: ${transaction.product.category}) from ${transaction.seller} for ${transaction.price}$ on ${transaction.date} (Status: ${transaction.status}) Notes: ${transaction.notes ?: "None"}"
                )
            }
        }
    }

    // Method to rate a seller
    fun rateUser(seller: User, rating: Int): Boolean {
        // Verify if the user has made a purchase from this seller
        val hasPurchased = transactionsAsBuyer.any { it.seller == seller.username }

        if (hasPurchased) {
            if (rating in 1..5) {
                seller.ratings.add(rating)
                println("$username rated ${seller.username} with $rating stars.")
                return true
            } else {
                println("Rating must be between 1 and 5.")
            }
        } else {
            println("$username cannot rate ${seller.username} because no purchase has been made.")
        }
        return false
    }

    // Method to calculate the average rating
    fun getAverageRating(): Double {
        return if (ratings.isNotEmpty()) {
            ratings.average()
        } else {
            0.0 // Default rating if no ratings are available
        }
    }

    // Show user rating
    fun showRating() {
        val averageRating = getAverageRating()
        if (ratings.isNotEmpty()) {
            println("${username}'s average rating is ${"%.2f".format(averageRating)} stars based on ${ratings.size} reviews.")
        } else {
            println("${username} has not been rated yet.")
        }
    }

    // Method to verify password
    fun verifyPassword(password: String): Boolean {
        return PasswordUtils.checkPassword(password, passwordHash)
    }
}

// UserManager class to handle user registration and login
class UserManager {
    private val users = mutableListOf<User>()

    fun registerUser(username: String, password: String, email: String, balance: Double): User? {
        if (users.any { it.username == username || it.email == email }) {
            println("Username or email already exists.")
            return null
        }
        val newUser = User(username, password.hashCode(), email, balance)
        users.add(newUser)
        println("User $username registered successfully.")
        return newUser
    }

    fun loginUser(username: String, password: String): User? {
        val user = users.find { it.username == username }
        if (user != null && user.verifyPassword(password)) {
            println("User $username logged in successfully.")
            return user
        } else {
            println("Invalid username or password.")
            return null
        }
    }
}

// Example usage
fun main() {
    val userManager = UserManager()

    // Register users
    val anna = userManager.registerUser("Anna", "password123", "anna@example.com", 100.0)
    val luke = userManager.registerUser("Luke", "securePass", "luke@example.com", 80.0)
    val maria = userManager.registerUser("Maria", "maria123", "maria@example.com", 50.0)

    // Login users
    val loggedInAnna = userManager.loginUser("Anna", "password123")
    val loggedInLuke = userManager.loginUser("Luke", "wrongPassword") // Incorrect password
    val loggedInMaria = userManager.loginUser("Maria", "maria123")

    if (loggedInAnna != null && loggedInLuke == null && loggedInMaria != null) {
        // Create products
        val phone = Product(1, "Phone", 75.0, true, "Electronics")
        val laptop = Product(2, "Laptop", 120.0, true, "Electronics")
        val table = Product(3, "Table", 120.0, true, "Furniture")

        // Anna lists products for sale
        loggedInAnna.listProduct(phone)
        loggedInAnna.listProduct(laptop)
        loggedInAnna.listProduct(table)

        // Luke tries to buy the phone
        loggedInMaria.buyProduct(table, loggedInAnna, notes = "Hello")

        // Check Maria's buyer transactions after purchasing
        loggedInMaria.showTransactionsAsBuyer()
        loggedInMaria.rateUser(loggedInAnna, 3)
        loggedInAnna.showRating()
    }
}
