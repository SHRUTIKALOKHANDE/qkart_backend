# mongoimport --uri 'mongodb+srv://admin:admin123@qkart-node.zzbn7.mongodb.net/qkart?retryWrites=true&w=majority' --drop --collection users --file data/export_qkart_users.json
# mongoimport --uri 'mongodb+srv://admin:admin123@qkart-node.zzbn7.mongodb.net/qkart?retryWrites=true&w=majority' --drop --collection products --file data/export_qkart_products.json

mongoimport --uri 'mongodb+srv://shrutikalokhande449:Lokhande@7j@cluster0.m51yeca.mongodb.net/?retryWrites=true&w=majority' --drop --collection users --file data/export_qkart_users.json
mongoimport --uri 'mongodb+srv://shrutikalokhande449:Lokhande@7@cluster0.m51yeca.mongodb.net/?retryWrites=true&w=majority' --drop --collection products --file data/export_qkart_products.json
