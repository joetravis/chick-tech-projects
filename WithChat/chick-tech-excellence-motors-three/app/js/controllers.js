'use strict';

/* Controllers */

angular.module('myApp.controllers', ['myApp.services'])
	.controller('HomeCtrl', ['$scope', function($scope) {
		$('a[href^="#/home"]').addClass("active");
		$('a[href^="#/contactus"]').removeClass("active");
		$('a[href^="#/vehicles"]').removeClass("active");
		$('a[href^="#/contactme"]').removeClass("active");
	}]).

	controller('ContactUsCtrl', ['$scope', function($scope) {
		$('a[href^="#/home"]').removeClass("active");
		$('a[href^="#/contactus"]').addClass("active");
		$('a[href^="#/vehicles"]').removeClass("active");
		$('a[href^="#/contactme"]').removeClass("active");
	}]).

	controller('VehiclesCtrl', ['$scope', '$firebase', 'CONFIGURL', 'getVehiclesFirebaseStore', function($scope, $firebase, CONFIGURL, getVehiclesFirebaseStore)  {
		$('a[href^="#/home"]').removeClass("active");
		$('a[href^="#/vehicles"]').addClass("active");
		$('a[href^="#/contactus"]').removeClass("active");
		$('a[href^="#/contactme"]').removeClass("active");

		$scope.widgets = getVehiclesFirebaseStore();

	}]).

	controller('ChatCtrl', ['$scope', '$modal', function($scope, $modal){
		$scope.chat = function(widget){
			var modalInstance = $modal.open({
				templateUrl: 'app/partials/modalchatcontent.html',
				controller: 'ChatModalInstanceCtrl',
				width: 50,
				resolve: {
					widget: function() {
						return widget;
					}
				}
			});
		}
	}]).

	controller('ContactMeCtrl', ['$scope', '$modal', function($scope, $modal) {
		$('a[href^="#/home"]').removeClass("active");
		$('a[href^="#/contactus"]').removeClass("active");
		$('a[href^="#/vehicles"]').removeClass("active");
		$('a[href^="#/contactme"]').addClass("active");

		$scope.contactinfo = {
			FirstName: ''
		};
		$scope.contactMe = function(widget){
			var modalInstance = $modal.open({
				templateUrl: 'app/partials/modalcontent.html',
				controller: 'ModalInstanceCtrl',
				resolve: {
					widget: function() {
						return widget;
					}
				}
			});
		};
	}]).

	controller('ModalInstanceCtrl', function ($scope, $modalInstance, widget){
		$scope.widget = widget;

		$scope.close = function(){
			$modalInstance.dismiss('cancel');
		};
	}).

	controller('ChatModalInstanceCtrl', ['$scope', '$modalInstance', 'widget', 'getChatFirebaseStore', function ($scope, $modalInstance, widget, getChatFirebaseStore){
		$scope.widget = widget;
		$scope.messagesRef = getChatFirebaseStore();
		$scope.username = '';
		$scope.message = '';
		$scope.userNameNotPresent = true;

		$scope.close = function(){
			$modalInstance.dismiss('cancel');
		};

		$scope.usernameFieldKeyPress = function(){
			$scope.userNameNotPresent = ($scope.username == '');
		};

		$scope.messageFieldKeyPress = function($e){
			if ($e.keyCode == 13) {
				//FIELD VALUES

				//SAVE DATA TO FIREBASE AND EMPTY FIELD
				$scope.messagesRef.push({name:$scope.username, text:$scope.message});
				$scope.message = '';
			}
		};

		$scope.messagesRef.limitToLast(10).on('child_added', function (snapshot) {
			//GET DATA
			var messageList = $('#example-messages');
			var data = snapshot.val();
			var username = data.name || "anonymous";
			var message = data.text;

			//CREATE ELEMENTS MESSAGE & SANITIZE TEXT
			var messageElement = $("<li>");
			var nameElement = $("<strong class='example-chat-username'></strong>")
			nameElement.text(username);
			messageElement.text(message).prepend(nameElement);

			//ADD MESSAGE
			messageList.append(messageElement)

			//SCROLL TO BOTTOM OF MESSAGE LIST
			messageList[0].scrollTop = messageList[0].scrollHeight;
		});
	}]);
