//ASSIM QUE A ROTA INDEX COMEÇAR

//IMPORTAR COMANDOS
$.getScript('js/comandos.js');      

//VERIFICAR SE TEM O BANCO NO LOCALSTORAGE
if(localStorage.getItem('banco')!==null && localStorage.getItem('banco')!==""){
    banco = JSON.parse(localStorage.getItem('banco'));
    temBanco = true;
}else{
    console.log('Não tem um banco de dados ainda!');
    temBanco = false;
}
//VERIFICAR SE TEM PERMISSAO DE USAR SPEECHRECOGNITION
window.plugins.speechRecognition.hasPermission(
    function(permissao){
        //SE NÃO TIVER PERMISSAO
        if(!permissao){
            //SOLICITAR A PERMISSÃO
            window.plugins.speechRecognition.requestPermission(
                function (temPermissao){
                    app.dialog.alert('Permissão concedida: '+temPermissao);
                }, function(erro){
                    app.dialog.alert('Request Permission error: '+erro);
                })

        }
    },function(error){
        app.dialog.alert('hasPermission error: '+error);
    })

//CLICOU NO BOTÃO FALAR
$("#BtnFalar").on('click',function(){
    let options = {
        language: "pt-BR",          
        showPopup: false,  
        showPartial: true 
      }
      
      //COMEÇOU A "ESCUTAR"
      window.plugins.speechRecognition.startListening(
        //SE SUCESSO
        function(dados){
            $.each(dados,function(index,texto){
                //COLOCAR O QUE ELA ENTENDE NO P CHAMADO PERGUNTA
                $("#pergunta").html("").append(texto);
                //PEGAR O VALOR DO QUE ELA ENTENDEU
                var pergunta = $("#pergunta").html().toLowerCase();
                console.log('Ela entendeu: '+pergunta);

                //VERIFICAR SE TEM BANCO
                if(temBanco){
                    $.each(banco,function(index,item){
                        //VERIFICAR SE A PERGUNTA ENTENDIDA É IGUAL P_FALADA
                        if(pergunta == item.p_falada){
                            falar(item.r_escrita,item.r_falada,false);
                        }
                    });
                }

                //VERIFICAR SE TEM COMANDO
                $.each(comandos,function(index,item){
                    //VERIFICAR SE A PERGUNTA ENTENDIDA É IGUAL P_FALADA
                    if(pergunta == item.entrada){
                        //SE TIVER COMANDO ESPECIAL
                        if(item.especial){
                            //EXECUTAR O COMANDO ESPECIAL
                            item.especial();
                        }else{
                            //SE NÃO, APENAS FALAR NORMALMENTE
                            falar(item.retorno_escrito,item.retorno_falado,item.rota);
                        }
                       
                    }
                });



            })
        }, 
        //SE DER ERRO
        function(erro){
           app.dialog.alert('Houve um erro: '+erro); 
        }, options)
});

function falar(r_escrita,r_falada,rota){
    TTS.speak({
        text: r_falada,
        locale: 'pt-BR',
        rate: 1.1
    }, function () {
        console.log('A assistente falou: '+r_escrita);
        if(rota){
            app.views.main.router.navigate(rota);
        }
    }, function (erro) {
        app.dialog.alert('Houve um erro: '+erro);
    });

    //SE ELA FALAR ESCREVER NA TELA A RESPOSTA
    var typed = new Typed('#resposta', {
        strings: [r+'^1000', ''],
        typeSpeed: 0,
        showCursor: false,
        onComplete: function (self) {
            toastBottom = app.toast.create({
                text: 'Fala concluída com sucesso!',
                closeTimeout: 2000,
            });
            toastBottom.open();
        }

    });

}