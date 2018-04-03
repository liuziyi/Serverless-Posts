var ApiBuilder = require('claudia-api-builder'),
	AWS = require('aws-sdk'),
  	api = new ApiBuilder(),
  	dynamoDb = new AWS.DynamoDB.DocumentClient();

/**********************************************/
/****************** CREATE ********************/
/**********************************************/
api.post('/posts', function(request){
	var params = {
		TableName: 'posts',
		Item: {
			postid: request.body.postId,
			title: request.body.title,
			body: request.body.body 
		}
	}
	return dynamoDb.put(params).promise();
},{success:201});

/********************************************/
/****************** GET *********************/
/********************************************/
api.get('/posts', function(request){
	return dynamoDb.scan({ TableName: 'posts' }).promise().then(res => res.Items);
});

/********************************************/
/***************** GET POST *****************/
/********************************************/
api.get('/posts/{id}', function(request){
	var params = {
		TableName: 'posts',
		Key: {
			postid: request.pathParams.id 
		}
	}
	return dynamoDb.get(params).promise().then(res => res.Item);
});

/********************************************/
/****************** EDIT ********************/
/********************************************/ 
api.put('/posts/{id}', function(request){
	var params = {
		TableName: 'posts',
		Item: {
			postid: request.pathParams.id,
			title: request.body.title,
			body: request.body.body 
		}
	}
	return dynamoDb.put(params).promise().then(res => res.Item);
});

/**********************************************/
/****************** DELETE ********************/
/**********************************************/
api.delete('/posts/{id}', function(request){
	id = request.pathParams.id;
	var params = {
		TableName: 'posts',
		Key: {
			postid: id 
		}
	}
	return dynamoDb.delete(params).promise().then(() => 'Deleted post with id "' + id + '"')
},{success: { contentType: 'text/plain'}});

module.exports = api;


