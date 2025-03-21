import java.time.LocalDateTime

// Product class represents a product for sale
class Product(val name: String, var price: Double, var available: Boolean = true)

// Class to record transactions
data class Transaction(
    val product: Product,
    val buyer: String,
    val seller: String,
    val price: Double,
    val status: String,
   // val quantity: Int = 1,
    val notes: String? = null,
    val date: LocalDateTime = LocalDateTime.now() // Automatically captures the current date and time
)

// User class
class User(val name: String, var balance: Double) {
    private val productsForSale = mutableListOf<Product>()
    private val transactionsAsSeller = mutableListOf<Transaction>()
    private val transactionsAsBuyer = mutableListOf<Transaction>()
    private val ratings = mutableListOf<Int>() // List to store ratings from other users

    // Method to list a product for sale
    fun listProduct(product: Product) {
        productsForSale.add(product)
        println("$name listed the product: ${product.name} for ${product.price}$")
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
                    buyer = name,
                    seller = seller.name,
                    price = product.price,
                    status = "Completed",
                    notes = notes
                )
                transactionsAsBuyer.add(transaction)
                seller.transactionsAsSeller.add(transaction)

                println("$name bought ${product.name} from ${seller.name} for ${product.price}$ on ${transaction.date}")
                return true
            } else {
                println("$name doesn't have enough balance to buy ${product.name}")
            }
        } else {
            println("${product.name} is not available for sale")
        }
        return false
    }

    // Method to show all products the user has for sale
    fun showProductsForSale() {
        if (productsForSale.isEmpty()) {
            println("$name has no products listed for sale.")
        } else {
            println("$name's products for sale:")
            productsForSale.forEach { product ->
                val availability = if (product.available) "Available" else "Sold"
                println("- ${product.name} for ${product.price}$ ($availability)")
            }
        }
    }

    // Method to show all transactions as a seller
    fun showTransactionsAsSeller() {
        if (transactionsAsSeller.isEmpty()) {
            println("$name has no sales transactions.")
        } else {
            println("$name's sales transactions:")
            transactionsAsSeller.forEach { transaction ->
                println(
                    "- Sold ${transaction.product.name} to ${transaction.buyer} for ${transaction.price}$ on ${transaction.date} (Status: ${transaction.status}) Notes: ${transaction.notes ?: "None"}"
                )
            }
        }
    }

    // Method to show all transactions as a buyer
    fun showTransactionsAsBuyer() {
        if (transactionsAsBuyer.isEmpty()) {
            println("$name has no purchase transactions.")
        } else {
            println("$name's purchase transactions:")
            transactionsAsBuyer.forEach { transaction ->
                println(
                    "- Bought ${transaction.product.name} from ${transaction.seller} for ${transaction.price}$ on ${transaction.date} (Status: ${transaction.status}) Notes: ${transaction.notes ?: "None"}"
                )
            }
        }
    }

// Method to rate a seller
    fun rateUser(seller: User, rating: Int): Boolean {
        // Verify if the user has made a purchase from this seller
        val hasPurchased = transactionsAsBuyer.any { it.seller == seller.name }

        if (hasPurchased) {
            if (rating in 1..5) {
                seller.ratings.add(rating)
                println("$name rated ${seller.name} with $rating stars.")
                return true
            } else {
                println("Rating must be between 1 and 5.")
            }
        } else {
            println("$name cannot rate ${seller.name} because no purchase has been made.")
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
            println("${name}'s average rating is ${"%.2f".format(averageRating)} stars based on ${ratings.size} reviews.")
        } else {
            println("${name} has not been rated yet.")
        }
    }
}
    


// Example usage
fun main() {
    // Create users
    val anna = User("Anna", 100.0)
    val luke = User("Luke", 80.0)

    // Create products
    val phone = Product("Phone", 75.0)
    val laptop = Product("Laptop", 120.0)
    val table = Product("Table", 120.0)

    // Anna lists products for sale
    anna.listProduct(phone)
    anna.listProduct(laptop)
    anna.listProduct(table)

    // Anna shows products for sale
    anna.showProductsForSale()

    // Luke tries to buy the phone
    luke.buyProduct(phone, anna, notes = "Urgent need for a new phone")

    // Show transactions
    anna.showTransactionsAsSeller()
    luke.showTransactionsAsBuyer()

    // Anna and Luke show updated product lists
    anna.showProductsForSale()
    luke.showProductsForSale()

    // Luke rates Anna
    luke.rateUser(anna, 5)

    // Anna's average rating
    anna.showRating()

    // Another user rates Anna
    val maria = User("Maria", 50.0)
    maria.buyProduct(table, anna) // Assuming Maria had made a purchase
    maria.rateUser(anna, 3)

    // Anna's updated average rating
    anna.showRating()

    maria.buyProduct(table, anna, notes = "Hello")
    // Check Maria's buyer transactions after purchasing
    maria.showTransactionsAsBuyer()
    
    maria.rateUser(anna, 3)
    anna.showRating()
    
}