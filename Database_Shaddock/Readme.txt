# Hướng dẫn import cơ sở dữ liệu MongoDB
1. Mở terminal và điều hướng đến thư mục chứa file JSON.
2. Chạy lệnh sau để import từng collection vào MongoDB:
   	mongoimport --db chatapp --collection users --file chatapp.users.json
	mongoimport --db chatapp --collection products --file chatapp.products.json
	mongoimport --db chatapp --collection carts --file chatapp.carts.json
	mongoimport --db chatapp --collection checkouts --file chatapp.checkouts.json
	mongoimport --db chatapp --collection orders --file chatapp.orders.json