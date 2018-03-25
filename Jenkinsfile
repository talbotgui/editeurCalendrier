#!groovy

// Define job properties
properties([buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '5')), pipelineTriggers([])])

pipeline {
	
	agent none

	stages {
		
		stage ('Checkout') {
			agent any
			steps {
				checkout scm
			}
		}

		stage ('Build') {
			agent any
			steps {
				sh "mvn clean compile"
			}
		}

		stage ('Production') { 
			agent none
			// Pour sauter le stage 'production' si la branche n'est pas le master
			when { branch 'master' }
			steps {
				script {

					// Pour traiter le timeout sans déclencher un failure
					long startTime = System.currentTimeMillis()
					try {
					
						// Pour ne pas laisser trainer l'attente d'une saisie durant plus de 1 jour
						timeout(time:1, unit:'DAYS') {
							// Demande de saisie avec milestone pour arrêter les builds précédents en attente au moment où un utilisateur répond à un build plus récent
							milestone(1)
							def userInput = input message: 'Production ?', parameters: [booleanParam(defaultValue: false, description: '', name: 'miseEnProduction')]
							milestone(2)

							// Installation en production et changement du nom indiquant le statut
							if (userInput) {
								node {
									currentBuild.displayName = currentBuild.displayName + " - deployed to production"
									sh "sed -i 's/\"\\/\"/\"\\/editeurCalendrier\\/\"/' ./dist/index.html"
									sh "mv ./dist/index.html ./dist/indexArenommer.html"
									sh 'echo "Déploiement de la nouvelle version en cours" > /var/www/html/editeurCalendrier/index.html'
									sh "rm -rf /var/www/html/editeurCalendrier/*"
									sh "cp -r ./dist/* /var/www/html/editeurCalendrier/"
									sh "mv /var/www/html/editeurCalendrier/indexArenommer.html /var/www/html/editeurCalendrier/index.html"
									sh "cd /var/www/html/editeurCalendrier/ && zip -r editeurCalendrier.zip *"
								}
							}
						}
					} catch(err) {
						long timePassed = System.currentTimeMillis() - startTime
                        if (timePassed >= 1 * 1000 * 3600 * 24) {
                            echo 'Timed out du passage en production'
                        } else {
                            throw err
                        }
					}
				}
			}
		}
	}
	
	post {
        success {
			node ('') {  }
			node ('') { step([$class: 'WsCleanup', notFailBuild: true]) }
        }
        unstable {
			node ('') {  }
			node ('') { step([$class: 'WsCleanup', notFailBuild: true]) }
		}
        failure {
			node ('') { emailext subject: "${env.JOB_NAME}#${env.BUILD_NUMBER} - Error during the build !", to: "talbotgui@gmail.com", body: "failure : ${e}"; }
			node ('') { step([$class: 'WsCleanup', notFailBuild: true]) }
        }
        //always {}
        //changed {}
    }
}
