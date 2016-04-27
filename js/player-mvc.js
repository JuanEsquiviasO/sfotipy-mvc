function Model(){
	this.actual = -1
	this.songs = []
	this._isPlaying = false
}
Model.prototype = new Observable()
Model.prototype.goTo = function( index ){
	this.setActive( index )
}
Model.prototype.setSongs = function( songs ){
	this.songs = songs
	this.trigger('songs-changed', this.songs)
}
Model.prototype.getActual = function(){
	return this.songs[ this.actual ]
}
Model.prototype.getActualIndex = function(){
	return this.actual
}
Model.prototype.setActive = function( index ){
	if( index < 0 || index >= this.songs.length ) index = 0
	this._isPlaying = true
	this.actual = index
	this.trigger('active-song', this.songs[ index ])
}

Model.prototype.setPlaying = function( bool ){
	this._isPlaying = bool
	if( bool ) this.trigger('playing')
	else this.trigger('paused')
}
Model.prototype.isPlaying = function(){
	return this._isPlaying
}

function View(){
	var self = this

	this.elems = {}
	this.elems.audio = document.createElement('audio')
	document.body.appendChild( this.elems.audio )

	this.elems.list = $('#list')
	this.elems.play = $('#play')
	this.elems.next = $('#next')
	this.elems.prev = $('#prev')
	this.elems.avatar = $('.image isotipo')
	this.elems.name = $('.playing .name')
	this.elems.artist = $('.playing .author')

	// Delegación del click
	this.elems.list.on('click', '.song', function(){
		self.trigger('song-clicked', $(this).attr('data-id'))
	})
	this.elems.play.on('click', function(){
		self.trigger('play-clicked')
		return false
	})
	this.elems.next.on('click', function(){
		self.trigger('next-clicked')
		return false
	})
	this.elems.prev.on('click', function(){
		self.trigger('prev-clicked')
		return false
	})

	// Creación de mi template de canciones
	this.template = Handlebars.compile( $('#song-tmpl').html() )
}
View.prototype = new Observable()
View.prototype.updateList = function( songList ){
	this.elems.list.html( this.template( { songs: songList } ) )
}
View.prototype.updateActive = function( song ){
	this.elems.avatar.attr('src', song.img)
	this.elems.name.text( song.name )
	this.elems.artist.text( song.artist )

	this.elems.audio.pause()
	this.elems.audio.src = song.src
	this.elems.audio.play()
}
View.prototype.playSong = function(){
	this.elems.audio.play()
}
View.prototype.pauseSong = function(){
	this.elems.audio.pause()
}

var controller = {
	init: function(){
		var self = this

		// Instancio mi modelo y vista
		this.model = new Model()
		this.view = new View()

		// Escuchar eventos del modelo
		this.model.on('songs-changed', function( e, songs ){
			self.view.updateList( songs )
		})
		this.model.on('active-song', function( e, song ){
			self.view.updateActive( song )
		})
		this.model.on('playing', function( e, song ){
			self.view.playSong( song )
		})
		this.model.on('paused', function( e, song ){
			self.view.pauseSong( song )
		})

		// Escuchar eventos de la vista
		this.view.on('song-clicked', function( e, index ){
			self.model.setActive( index )
		})
		this.view.on('play-clicked', function(){
			self.model.setPlaying( !self.model.isPlaying() )
		})
		this.view.on('next-clicked', function(){
			self.model.goTo( self.model.getActualIndex() + 1 )
		})
		this.view.on('prev-clicked', function(){
			self.model.goTo( self.model.getActualIndex() - 1 )
		})

		// Inicializacion
		this.model.setSongs([
			{
				name: 'Dont Look Back In Anger',
				artist: 'Oasis',
				src: 'media/Oasis_Dont_Look_Back_In_Anger.mp3',
				img: 'img/songs/oasis-back-in-anger.jpg'
			},
			{
				name: 'Stand by me',
				artist: 'Oasis',
				src: 'media/Oasis_Stand_By_me.mp3',
				img: 'img/songs/stand_by_me.jpg'
			},
			{
				name: 'Live Forever',
				artist: 'Oasis',
				src: 'media/Oasis_ Live_Forever.mp3',
				img: 'img/songs/Live_Forever.jpg'
			},
			{
				name: 'Wonderwall',
				artist: 'Oasis',
				src: 'media/Oasis_Wonderwall.mp3',
				img: 'img/songs/wonderwall.jpg'
			},
			{
				name: 'Do You know what I mean',
				artist: 'Oasis',
				src: 'media/Oasis_D’You_Know_What_I_Mean.mp3',
				img: 'img/songs/Do_You_know_what_I_mean.jpg'
			},
			{
				name: 'Whatever',
				artist: 'Oasis',
				src: 'media/Oasis_Whatever.mp3',
				img: 'img/songs/test.jpg'
			},
			{
				name: 'All Around the World',
				artist: 'Oasis',
				src: 'media/Oasis_ All_ Around_The_World.mp3',
				img: 'img/songs/All_around_the_world.jpg'
			},
			{
				name: 'Stop Crying Your Heart Out',
				artist: 'Oasis',
				src: 'media/Oasis_Stop_Crying_Your_Heart_Out.mp3',
				img: 'img/songs/Oasis_Stop_Crying_Your_Heart_Out.jpg'
			}
		])
		this.model.setActive( 0 )
	}
}

controller.init()
