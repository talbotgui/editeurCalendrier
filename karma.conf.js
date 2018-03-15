let path = require('path');

// @see http://karma-runner.github.io/1.0/config/configuration-file.html
// Pour lancer les tests : ng test
// Pour lancer les tests avec couverture de code : ng test --code-coverage --reporters=coverage-istanbul,junit
module.exports = function (config) {
  config.set({
    // Répertoire de base permettant la résolution des chemins
    basePath: '',
    // Liste des frameworks de test à utiliser
    frameworks: ['jasmine', '@angular/cli'],
    // Liste des plugins à charger
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    // Nécessaire pour l'exécution des tests Jasmine
    client: { clearContext: false },
    // Liste des rapporteurs à déclencher
    // kjhtml : pour avoir le résumé dans le navigateur
    reporters: ['progress', 'kjhtml'],
    // Port utilisé par Karma
    port: 9876,
    // Couleurs dans les logs
    colors: true,
    // Niveau de log
    logLevel: config.LOG_INFO,
    // Active la surveillance des fichiers et la ré-exécution des tests en cas de modification
    autoWatch: true,
    // Délai d'attente pour l'exécution des tests après la détection de la modification d'un fichier (pour permettre la sauvegarde d'autres fichiers)
    autoWatchBatchDelay: 800,
    // Execution unique des tests
    singleRun: false,
    // Configuration particulière pour démarrer Chrome en debug et permettre à VSCode de s'y connecter
    customLaunchers: { ChromeDebugging: { base: 'Chrome', flags: ['--remote-debugging-port=9333'] } },
    // Le(s) browser(s) à utiliser pour les tests
    browsers: ['ChromeDebugging'],
    // Configuration pour Angular : mode dev
    angularCli: { environment: 'dev' }
  });
};
