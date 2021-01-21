'use strict';
(function () {
    'use strict';
    function TagEditorController($scope, $routeParams, $timeout, templateResource, assetsService, notificationsService, editorState, navigationService, appState, macroService, treeService, contentEditingHelper, localizationService, angularHelper, templateHelper, editorService) {
        var vm = this;
        // ace configuration
        vm.aceOption = {
            mode: 'razor',
            theme: 'chrome',
            showPrintMargin: false,
            advanced: {
                fontSize: '14px',
                enableSnippets: false,
                //The Razor mode snippets are awful (Need a way to override these)
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: false
            },
            onLoad: function onLoad(_editor) {

                //Update the auto-complete method to use ctrl+alt+space
                _editor.commands.bindKey('ctrl-alt-space', 'startAutocomplete');
                // Unassigns the keybinding (That was previously auto-complete)
                // As conflicts with our own tree search shortcut
                _editor.commands.bindKey('ctrl-space', null);
                // Assign new keybinding
                _editor.commands.addCommands([
                    // Disable (alt+shift+K)
                    // Conflicts with our own show shortcuts dialog - this overrides it
                    {
                        name: 'unSelectOrFindPrevious',
                        bindKey: 'Alt-Shift-K',
                        exec: function exec() {
                            // Toggle the show keyboard shortcuts overlay
                            $scope.$apply(function () {
                                vm.showKeyboardShortcut = !vm.showKeyboardShortcut;
                            });
                        },
                        readOnly: true
                    }
                ]);
                // initial cursor placement
                // Keep cursor in name field if we are create a new template
                // else set the cursor at the bottom of the code editor
                if (!create) {
                    $timeout(function () {
                        vm.editor.navigateFileEnd();
                        vm.editor.focus();
                        persistCurrentLocation();
                    });
                }
                // change on blur, focus
                vm.editor.on('blur', persistCurrentLocation);
                vm.editor.on('focus', persistCurrentLocation);
                vm.editor.on('change', changeAceEditor);
            }
        };

        
        vm.init = function () {
            // we need to load this somewhere, for now its here.
            assetsService.loadCss('lib/ace-razor-mode/theme/razor_chrome.css', $scope).then(function () {
                vm.ready();
            });
        };

        vm.ready = function () {            
                        
        };
                   
         function changeAceEditor() {
            setFormState('dirty');
        }
      
        vm.init();
    }
    angular.module('umbraco').controller('SitePoint.TagEditorController', TagEditorController);
}());